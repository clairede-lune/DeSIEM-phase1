// Import the DecentralizedSIEM contract
const DecentralizedSIEM = artifacts.require("DecentralizedSIEM");

contract("DecentralizedSIEM", (accounts) => {
    let decentralizedSIEM;

    // Run before each test
    beforeEach(async () => {
        decentralizedSIEM = await DecentralizedSIEM.new(); // Deploy a new contract instance
    });

    it("should add a new security log", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        // Add a security log
        await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });

        // Get the log
        const log = await decentralizedSIEM.logs(1); // The first log should have id 1

        // Assert that the log was added correctly
        assert.equal(log.id.toString(), "1", "Log ID should be 1");
        assert.equal(log.source, source, "Source should match");
        assert.equal(log.eventType, eventType, "Event type should match");
        assert.equal(log.description, description, "Description should match");
        assert.equal(log.severity, severity, "Severity should match");
        assert.equal(log.isResolved, false, "Log should not be resolved initially");
        assert.equal(log.reporter, accounts[0], "Reporter should be the account that added the log");
    });

    it("should not allow unauthorized user to add a log", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        try {
            await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[1] });
            assert.fail("Expected revert not received");
        } catch (error) {
            assert(error.message.includes("Not authorized"), "Error message should contain 'Not authorized'");
        }
    });
});





