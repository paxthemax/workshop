const { BN, shouldFail } = require('openzeppelin-test-helpers');

const ROLE_NONE = new BN(0);
const ROLE_WAREHOUSE_ADMIN = new BN(1);
const ROLE_TOKEN_GENERATION_ADMIN = new BN(2);
const INVALID_ROLE = new BN(99);

const AGLDTToken = artifacts.require('AGLDTToken');
const ASLVTToken = artifacts.require('AGLDTToken');
const Auth = artifacts.require('Auth');

contract('Auth', ([_, owner, admin, other]) => {
  beforeEach(async () => {
    this.gldToken = await AGLDTToken.new({ from: owner });
    this.slvToken = await ASLVTToken.new({ from: owner });
    this.auth = await Auth.new(
      AGLDTToken.address,
      ASLVTToken.address,
      { from: owner });
    await this.gldToken.addMinter(admin, { from: owner });
    await this.slvToken.addMinter(admin, { from: owner });
  });

  describe('while adding a new address to the whitelist', () => {
    it('should reject if not signed by the owner', async () => {
      await shouldFail.reverting(this.auth.add(admin, ROLE_WAREHOUSE_ADMIN, { from: other }));
    });

    it('should reject an invalid role', async () => {
      await shouldFail.reverting(this.auth.add(admin, INVALID_ROLE, { from: owner }));
    });
  });

  describe('while getting the role codes', () => {
    it('should return the warehouse admin role code', async () => {
      (await this.auth.roleWarehouseAdmin()).should.be.bignumber.equal(ROLE_WAREHOUSE_ADMIN);
    });

    it('should return the token generation admin role code', async () => {
      (await this.auth.roleTokenGenerationAdmin()).should.be.bignumber.equal(ROLE_TOKEN_GENERATION_ADMIN);
    });
  });

  describe('when checking if address is a warehouse admin', () => {
    it('should return false if address is not a warehouse admin', async () => {
      (await this.auth.isWarehouseAdmin(other)).should.be.equal(false);
    });

    it('should return true if address is a warehouse admin', async () => {
      await this.auth.add(admin, ROLE_WAREHOUSE_ADMIN, { from: owner });
      (await this.auth.isWarehouseAdmin(admin)).should.be.equal(true);
    });
  });

  describe('when checking if address is a token generation admin', () => {
    it('should return false if address is not a token generation admin', async () => {
      (await this.auth.isTokenGenerationAdmin(other)).should.be.equal(false);
    });

    it('should return true if address is a token generation admin', async () => {
      await this.auth.add(admin, ROLE_TOKEN_GENERATION_ADMIN, { from: owner });
      (await this.auth.isTokenGenerationAdmin(admin)).should.be.equal(true);
    });
  });

  describe('when verifying the role of a given address', () => {
    it('should return null role for a non-whitelisted address', async () => {
      (await this.auth.verifyAddress(other)).should.be.bignumber.equal(ROLE_NONE);
    });

    it('should return the correct role for a whitelisted address', async () => {
      await this.auth.add(admin, ROLE_WAREHOUSE_ADMIN, { from: owner });
      (await this.auth.verifyAddress(admin)).should.be.bignumber.equal(ROLE_WAREHOUSE_ADMIN);
    });
  });

  describe('when checking if address is a warehouse admin', () => {
    it('should return false if address is not a warehouse admin', async () => {
      (await this.auth.isWarehouseAdmin(other)).should.be.equal(false);
    });

    it('should return true if address is a warehouse admin', async () => {
      await this.auth.add(admin, ROLE_WAREHOUSE_ADMIN, { from: owner });

      (await this.auth.isWarehouseAdmin(admin)).should.be.equal(true);
    });
  });

  describe('when checking if address is a token generation admin', () => {
    it('should return false if address is not a token generation admin', async () => {
      (await this.auth.isTokenGenerationAdmin(other)).should.be.equal(false);
    });

    it('should return true if address is a token generation admin', async () => {
      await this.auth.add(admin, ROLE_TOKEN_GENERATION_ADMIN, { from: owner });

      (await this.auth.isTokenGenerationAdmin(admin)).should.be.equal(true);
    });
  });
});
