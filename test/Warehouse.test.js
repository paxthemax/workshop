const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const BN_ZERO = new BN(0);
const BN_ONE = new BN(1);

const ENTRY_NULL_TYPE = new BN(0);
const ENTRY_GOLD_TYPE = new BN(1);
const ENTRY_SILVER_TYPE = new BN(2);
const ENTRY_ILLEGAL_TYPE = new BN(99);

const ROLE_WAREHOUSE_ADMIN = new BN(1);
const ROLE_TOKEN_ADMIN = new BN(2);

const TEST_TOTAL = new BN(1000);
const TEST_META = 'metadata here';
const TEST_LINKS = 'links here';

const { ZERO_ADDRESS } = constants;

const AGLDTToken = artifacts.require('AGLDTToken');
const ASLVTToken = artifacts.require('AGLDTToken');
const Auth = artifacts.require('Auth');
const Warehouse = artifacts.require('Warehouse');

contract('Warehouse', ([_, owner, admin, tokenAdmin, other]) => {
  const testEntryDefaults = {
    from: admin,
    type: ENTRY_GOLD_TYPE,
    total: TEST_TOTAL,
    metadata: TEST_META,
    links: TEST_LINKS,
    salt: 0,
  };

  const warehouseDefaults = {
    authAdr: null,
    gldTokenAdr: null,
    slvTokenAdr: null,
  };

  // Helper function for creating a valid string ID
  const newID = (params) => {
    params = Object.assign({}, testEntryDefaults, params);
    const idhex = web3.utils.sha3(JSON.stringify(params));
    return idhex.substring(2);
  };

  // Helper function for creating a new warehouse entry
  const newTestEntry = (params) => {
    const batchID = newID(params);
    const { from, type, total, metadata, links } = Object.assign({}, testEntryDefaults, params);
    return this.warehouse.createEntry(batchID, type, total, metadata, links, { from: from });
  };

  // Helper function for creating a warehouse contract instance
  const newWarehouse = (params) => {
    let { authAdr, gldToken, slvToken } =
      Object.assign({}, warehouseDefaults, params);

    if (!authAdr) authAdr = this.auth.address;
    if (!gldToken) gldToken = this.gldToken.address;
    if (!slvToken) slvToken = this.slvToken.address;

    return Warehouse.new(authAdr, gldToken, slvToken);
  };

  beforeEach(async () => {
    this.gldToken = await AGLDTToken.new({ from: owner });
    this.slvToken = await ASLVTToken.new({ from: owner });
    this.auth = await Auth.new(
      AGLDTToken.address,
      ASLVTToken.address,
      { from: owner });
  });

  it('should create different test IDs', async () => {
    const id1 = newID({ salt: 0 });
    const id2 = newID({ salt: 1 });
    id1.should.not.be.equal(id2);
  });

  context('when constructing a Warehouse', () => {
    it('should revert if the auth contract address is zero', async () => {
      await shouldFail.reverting.withMessage(
        newWarehouse({ authAdr: ZERO_ADDRESS }), 'Auth contract address must not be zero'
      );
    });

    it('should revert if the gold token contract address is zero', async () => {
      await shouldFail.reverting.withMessage(
        newWarehouse({ gldToken: ZERO_ADDRESS }), 'Gold token contract address must not be zero'
      );
    });

    it('should revert if the silver token contract address is zero', async () => {
      await shouldFail.reverting.withMessage(
        newWarehouse({ slvToken: ZERO_ADDRESS }), 'Silver token contract address must not be zero'
      );
    });

    it('should construct a Warehouse with valid parameters', async () => {
      await newWarehouse();
    });
  });

  context('with warehouse', () => {
    beforeEach(async () => {
      await this.auth.add(admin, ROLE_WAREHOUSE_ADMIN, { from: owner });
      this.warehouse = await newWarehouse();
    });

    context('while creating a new entry', () => {
      it('should revert if not signed by warehouse admin', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ from: other }), 'Must be signed by a warehouse admin address'
        );
      });

      it('should revert if the entry type is null', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ type: ENTRY_NULL_TYPE }), 'Illegal entry type');
      });

      it('should revert if the entry type is an illegal value', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ type: ENTRY_ILLEGAL_TYPE }), 'Illegal entry type');
      });

      it('should revert if total amount is zero', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ total: BN_ZERO }), 'Total must not be zero'
        );
      });

      it('should revert if metadata string is empty', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ metadata: '' }), 'Metadata must not be empty'
        );
      });

      it('should revert if document links string is empty', async () => {
        await shouldFail.reverting.withMessage(
          newTestEntry({ links: '' }), 'Links must not be empty'
        );
      });

      it('should add a valid entry and emit event', async () => {
        const { logs } = await newTestEntry();

        // Check if event has correct ID and fields
        const expectedID = newID();
        expectEvent.inLogs(logs, 'NewEntry', {
          entryType: ENTRY_GOLD_TYPE,
          batchID: expectedID,
          total: TEST_TOTAL,
        });

        // Count should be exactly one
        (await this.warehouse.count()).should.be.bignumber.equal(BN_ONE);
      });

      it('should not allow duplicate entries with the same ID', async () => {
        await newTestEntry();

        // Duplicate entry, with the same ID
        await shouldFail.reverting.withMessage(newTestEntry(), 'Entry already exists');
      });
    });

    context('while getting an entry', () => {
      it('should return a null entry for a non-existant id', async () => {
        const BAD_ID = 'deadbeef';
        const { entryType } = await this.warehouse.getEntry(BAD_ID);

        // Return value is null
        entryType.should.be.bignumber.equal(ENTRY_NULL_TYPE);
      });

      it('should return an the correct fields for an exisitng entry', async () => {
        await newTestEntry();

        const id = newID();
        const { entryType, total, meta, documentLinks, matched } = await this.warehouse.getEntry(id);

        // Check all fields are matching
        entryType.should.be.bignumber.equal(ENTRY_GOLD_TYPE);
        total.should.be.bignumber.equal(TEST_TOTAL);
        meta.should.be.equal(TEST_META);
        documentLinks.should.be.equal(TEST_LINKS);
        matched.should.be.equal(false);
      });
    });

    context('while getting total amount of an entry', () => {
      it('should return a null entry for a non-existant id', async () => {
        const BAD_ID = 'deadbeef';

        (await this.warehouse.getTotalAmount(BAD_ID)).should.be.bignumber.equal(BN_ZERO);
      });

      it('should return an the correct total amount for an exisitng entry', async () => {
        await newTestEntry();
        const id = newID();

        (await this.warehouse.getTotalAmount(id)).should.be.bignumber.equal(TEST_TOTAL);
      });
    });

    context('while generating tokens', () => {
      beforeEach(async () => {
        // await this.auth.add(tokenAdmin, ROLE_TOKEN_ADMIN, { from: owner });

        // Create gold and silver entries
        await newTestEntry({ type: ENTRY_GOLD_TYPE, salt: 0 });
        await newTestEntry({ type: ENTRY_SILVER_TYPE, salt: 1 });

        // Generate batch IDs
        this.goldEntryID = newID({ salt: 0 });
        this.silverEntryID = newID({ type: ENTRY_SILVER_TYPE, salt: 1 });
      });

      it('should revert if not signed by a token admin', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.goldEntryID, ENTRY_GOLD_TYPE, TEST_TOTAL, { from: other }),
          'Must be signed by a token generation admin address'
        );
      });

      it('should revert on null type', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.goldEntryID, ENTRY_NULL_TYPE, TEST_TOTAL, { from: tokenAdmin }),
          'Illegal type'
        );
      });

      it('should revert on illegal type', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.goldEntryID, ENTRY_ILLEGAL_TYPE, TEST_TOTAL, { from: tokenAdmin }),
          'Illegal type'
        );
      });

      it('should revert on zero amount', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.goldEntryID, ENTRY_GOLD_TYPE, BN_ZERO, { from: tokenAdmin }),
          'Amount cannot be zero'
        );
      });

      it('should revert if type does not match warehouse entry', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.silverEntryID, ENTRY_GOLD_TYPE, TEST_TOTAL, { from: tokenAdmin }),
          'Type does not match warehouse entry'
        );
      });

      it('should revert if amount does not match warehouse entry', async () => {
        await shouldFail.reverting.withMessage(
          this.warehouse.generateTokens(this.goldEntryID, ENTRY_GOLD_TYPE, BN_ONE, { from: tokenAdmin }),
          'Amount does not match warehouse entry'
        );
      });

      it('should generate tokens and emit a Matched event', async () => {
        const { logs } = await this.warehouse.generateTokens(
          this.goldEntryID, ENTRY_GOLD_TYPE, TEST_TOTAL, { from: tokenAdmin });
        expectEvent.inLogs(logs, 'Matched', { batchID: this.goldEntryID });

        // TODO: check ERC-20 token balance
      });
    });
  }); // warehouse tests
}); // contract
