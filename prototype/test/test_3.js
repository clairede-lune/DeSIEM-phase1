// Import the DecentralizedSIEM contract
const DecentralizedSIEM = artifacts.require("DecentralizedSIEM");

contract("DecentralizedSIEM", (accounts) => {
    let decentralizedSIEM;

    beforeEach(async () => {
        decentralizedSIEM = await DecentralizedSIEM.new(); // Deploy a new contract instance
    });

    it("should allow admin to add an authorized analyst", async () => {
        await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[0] });
        const isAuthorized = await decentralizedSIEM.authorizedAnalysts(accounts[1]);
        assert.isTrue(isAuthorized, "Account should be authorized as an analyst");
    });

    it("should not allow non-admin to add an analyst", async () => {
        try {
            await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Error message should contain 'Only admin'");
        }
    });

    it("should allow admin to remove an authorized analyst", async () => {
        await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[0] });
        await decentralizedSIEM.removeAnalyst(accounts[1], { from: accounts[0] });
        const isAuthorized = await decentralizedSIEM.authorizedAnalysts(accounts[1]);
        assert.isFalse(isAuthorized, "Account should be removed from authorized analysts");
    });

    it("should not allow non-admin to remove an analyst", async () => {
        await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[0] });
        try {
            await decentralizedSIEM.removeAnalyst(accounts[1], { from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Error message should contain 'Only admin'");
        }
    });

    it("should allow admin to pause the contract", async () => {
        await decentralizedSIEM.pauseContract({ from: accounts[0] });
        const isPaused = await decentralizedSIEM.contractPaused();
        assert.isTrue(isPaused, "Contract should be paused");
    });

    it("should not allow non-admin to pause the contract", async () => {
        try {
            await decentralizedSIEM.pauseContract({ from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Error message should contain 'Only admin'");
        }
    });

    it("should allow admin to unpause the contract", async () => {
        await decentralizedSIEM.pauseContract({ from: accounts[0] });
        await decentralizedSIEM.unpauseContract({ from: accounts[0] });
        const isPaused = await decentralizedSIEM.contractPaused();
        assert.isFalse(isPaused, "Contract should be unpaused");
    });

    it("should not allow non-admin to unpause the contract", async () => {
        await decentralizedSIEM.pauseContract({ from: accounts[0] });
        try {
            await decentralizedSIEM.unpauseContract({ from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Only admin can perform this action"), "Error message should contain 'Only admin'");
        }
    });
});


