const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

const { ZERO_ADDRESS } = constants;
const ROLE_NONE = new BN(0);
const ROLE_TYPE_ONE = new BN(1);
const ROLE_TYPE_TWO = new BN(2);

const BaseWhitelist = artifacts.require('BaseWhitelist');

// TODO: reject change to same role?

contract('BaseWhitelist', ([_, owner, admin, other]) => {
  beforeEach(async () => {
    this.whitelist = await BaseWhitelist.new({ from: owner });
  });

  context('while getting a role of an address', () => {
    it('should return null role for a non whitelisted address', async () => {
      (await this.whitelist.getRole(other)).should.be.bignumber.equal(ROLE_NONE);
    });

    it('should return the role of a whitelisted address', async () => {
      await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });

      (await this.whitelist.getRole(admin)).should.be.bignumber.equal(ROLE_TYPE_ONE);
    });
  });

  context('while adding a new address/role', () => {
    it('should revert if not signed by owner', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.add(admin, ROLE_TYPE_ONE, { from: other }), 'Must be owner');
    });

    it('should revert if adding a zero address', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.add(ZERO_ADDRESS, ROLE_TYPE_ONE, { from: owner }), 'Cannot add zero address');
    });

    it('should revert if adding an address with null role', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.add(admin, ROLE_NONE, { from: owner }), 'Cannot set null value for role');
    });

    it('should accept a new, non whitelisted address', async () => {
      const { logs } = await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });
      expectEvent.inLogs(logs, 'Added', { addr: admin, role: ROLE_TYPE_ONE });
    });

    it('should revert on repeatedly adding adding a whitelisted address', async () => {
      await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });

      await shouldFail.reverting.withMessage(
        this.whitelist.add(admin, ROLE_TYPE_TWO, { from: owner }), 'Address is whitelisted');
    });
  });

  context('while changing a role of an existing address', () => {
    it('should revert if not signed by owner', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.changeRole(admin, ROLE_TYPE_TWO, { from: other }), 'Must be owner');
    });

    it('should revert if changing the zero address', async () => {
      await shouldFail.reverting(
        this.whitelist.changeRole(ZERO_ADDRESS, ROLE_TYPE_ONE, { from: owner }), 'Cannot edit zero address');
    });

    it('should revert if changing an address to a null role', async () => {
      await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });

      await shouldFail.reverting.withMessage(
        this.whitelist.changeRole(admin, ROLE_NONE, { from: owner }), 'Cannot set null value for role');
    });

    it('should revert if changing an address that is not whitelisted', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.changeRole(other, ROLE_TYPE_ONE, { from: owner }), 'Address is not whitelisted');
    });

    it('should accept changing an existing address to a new role', async () => {
      await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });

      const { logs } = await this.whitelist.changeRole(admin, ROLE_TYPE_TWO, { from: owner });
      expectEvent.inLogs(logs, 'ChangedRole', { addr: admin, newRole: ROLE_TYPE_TWO });
      (await this.whitelist.getRole(admin)).should.be.bignumber.equal(ROLE_TYPE_TWO);
    });
  });

  context('while removing an address from the whitelist', () => {
    it('should reject if not signed by owner', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.remove(admin, { from: other }),
        'Must be owner'
      );
    });

    it('should reject removing zero address', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.remove(ZERO_ADDRESS, { from: owner }), 'Cannot remove zero address');
    });

    it('should reject removing an address not in whitelist', async () => {
      await shouldFail.reverting.withMessage(
        this.whitelist.remove(other, { from: owner }), 'Address is not whitelisted');
    });

    it('should remove an existing address', async () => {
      await this.whitelist.add(admin, ROLE_TYPE_ONE, { from: owner });

      const { logs } = await this.whitelist.remove(admin, { from: owner });
      expectEvent.inLogs(logs, 'Removed', { addr: admin });
      (await this.whitelist.getRole(admin)).should.be.bignumber.equal(ROLE_NONE);
    });
  });
});
