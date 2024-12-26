// Import the DecentralizedSIEM contract
const DecentralizedSIEM = artifacts.require("DecentralizedSIEM");

contract("DecentralizedSIEM", (accounts) => {
    let decentralizedSIEM;

    beforeEach(async () => {
        decentralizedSIEM = await DecentralizedSIEM.new(); // Deploy a new contract instance
    });

    it("should add a new security log", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        const result = await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });

        assert.equal(result.logs[0].event, "LogAdded", "LogAdded event should be emitted");
        assert.equal(result.logs[0].args.eventType, eventType, "Event type should match");
        assert.equal(result.logs[0].args.severity, severity, "Severity should match");
    });

    it("should allow authorized user to resolve a log", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        // Add a log first
        await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });
        
        // Resolve the log
        const resolutionNotes = "Resolved by checking logs.";
        const result = await decentralizedSIEM.resolveLog(1, resolutionNotes, { from: accounts[0] });

        assert.equal(result.logs[0].event, "LogResolved", "LogResolved event should be emitted");
        assert.equal(result.logs[0].args.resolver, accounts[0], "Resolver should match the reporter");
        assert.equal(result.logs[0].args.resolutionNotes, resolutionNotes, "Resolution notes should match");
    });

    it("should not allow unauthorized user to resolve a log", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        // Add a log first
        await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });

        try {
            await decentralizedSIEM.resolveLog(1, "Unauthorized resolution attempt.", { from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Not authorized"), "Error message should contain 'Not authorized'");
        }
    });

    it("should update log description", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        // Add a log first
        await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });

        const newDescription = "Updated: Unauthorized access attempt detected.";
        const result = await decentralizedSIEM.updateLogDescription(1, newDescription, { from: accounts[0] });

        const log = await decentralizedSIEM.logs(1);
        assert.equal(log.description, newDescription, "Log description should be updated");
        assert.equal(result.logs[0].event, "LogUpdated", "LogUpdated event should be emitted");
    });

    it("should not allow unauthorized user to update log description", async () => {
        const source = "Firewall";
        const eventType = "Intrusion Attempt";
        const description = "Unauthorized access attempt detected.";
        const severity = "High";

        // Add a log first
        await decentralizedSIEM.addSecurityLog(source, eventType, description, severity, { from: accounts[0] });

        try {
            await decentralizedSIEM.updateLogDescription(1, "Unauthorized update attempt.", { from: accounts[1] });
            assert.fail("Expected revert not received"); // Fail if no error is thrown
        } catch (error) {
            assert(error.message.includes("Not authorized"), "Error message should contain 'Not authorized'");
        }
    });

    it("should allow admin to add an authorized analyst", async () => {
        await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[0] });
        const isAuthorized = await decentralizedSIEM.authorizedAnalysts(accounts[1]);
        assert.isTrue(isAuthorized, "Account should be authorized as an analyst");
    });

    it("should allow admin to remove an authorized analyst", async () => {
        await decentralizedSIEM.addAnalyst(accounts[1], { from: accounts[0] });
        await decentralizedSIEM.removeAnalyst(accounts[1], { from: accounts[0] });
        const isAuthorized = await decentralizedSIEM.authorizedAnalysts(accounts[1]);
        assert.isFalse(isAuthorized, "Account should be removed from authorized analysts");
    });
});
