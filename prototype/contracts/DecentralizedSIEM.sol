// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedSIEM {
    // Structure for security logs
    struct SecurityLog {
        uint256 id;                // Unique identifier for each log
        string source;             // Source of the security event
        string eventType;          // Type of security event
        string description;        // Detailed description
        uint256 timestamp;         // When the event occurred
        address reporter;          // Who reported the event
        bool isResolved;           // Resolution status
        string severity;           // Severity level of the event
        address resolver;          // Who resolved the event
        string resolutionNotes;    // Notes regarding the resolution
        uint256 resolvedAt;        // Timestamp when the log was resolved
    }

    // State variables
    mapping(uint256 => SecurityLog) public logs;                   // Stores all security logs
    mapping(address => bool) public authorizedAnalysts;            // Track authorized analysts
    mapping(address => uint256[]) public analystLogs;              // Track logs per analyst
    uint256 public logCount;                                        // Keeps track of total logs
    address public admin;                                           // Admin address
    bool public contractPaused;                                    // Emergency pause functionality
    
    // Events
    event LogAdded(uint256 indexed id, string eventType, string severity, address reporter);
    event LogResolved(uint256 indexed id, address resolver, string resolutionNotes);
    event AnalystAdded(address indexed analyst);
    event AnalystRemoved(address indexed analyst);
    event LogUpdated(uint256 indexed id, string description);
    event ContractPaused(address by);
    event ContractUnpaused(address by);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedAnalysts[msg.sender] || msg.sender == admin, "Not authorized");
        _;
    }

    modifier whenNotPaused() {
        require(!contractPaused, "Contract is paused");
        _;
    }

    constructor() {
        admin = msg.sender;                      // Set the contract deployer as admin
        logCount = 0;                            // Initialize log count
        authorizedAnalysts[msg.sender] = true;  // Authorize the admin as an analyst
        contractPaused = false;                   // Initialize contract as not paused
    }

    // Function to add new security log with severity
    function addSecurityLog(
        string memory _source,
        string memory _eventType,
        string memory _description,
        string memory _severity
    ) public whenNotPaused onlyAuthorized { // Use the onlyAuthorized modifier here
        logCount++;
        logs[logCount] = SecurityLog(
            logCount,
            _source,
            _eventType,
            _description,
            block.timestamp,
            msg.sender,
            false,
            _severity,
            address(0),
            "",
            0
        );

        analystLogs[msg.sender].push(logCount);  // Track log by reporter
        emit LogAdded(logCount, _eventType, _severity, msg.sender);
    }


    // Enhanced resolve log function with notes
    function resolveLog(
        uint256 _id, 
        string memory _resolutionNotes
    ) public onlyAuthorized whenNotPaused {
        require(_id <= logCount, "Log does not exist");
        require(!logs[_id].isResolved, "Log already resolved");
        
        SecurityLog storage log = logs[_id];
        log.isResolved = true;
        log.resolver = msg.sender;
        log.resolutionNotes = _resolutionNotes;
        log.resolvedAt = block.timestamp;
        
        emit LogResolved(_id, msg.sender, _resolutionNotes);
    }

    // Function to add authorized analyst
    function addAnalyst(address _analyst) public onlyAdmin whenNotPaused {
        require(!authorizedAnalysts[_analyst], "Already an analyst");
        authorizedAnalysts[_analyst] = true;
        emit AnalystAdded(_analyst);
    }

    // Function to remove authorized analyst
    function removeAnalyst(address _analyst) public onlyAdmin {
        require(_analyst != admin, "Cannot remove admin");
        require(authorizedAnalysts[_analyst], "Not an analyst");
        authorizedAnalysts[_analyst] = false;
        emit AnalystRemoved(_analyst);
    }

    // Function to update log description
    function updateLogDescription(uint256 _id, string memory _newDescription) public onlyAuthorized whenNotPaused {
        require(_id <= logCount, "Log does not exist");
        
        SecurityLog storage log = logs[_id];
        log.description = _newDescription;  // Update the log description
        emit LogUpdated(_id, _newDescription); // Emit event for log update
    }

    // Function to pause the contract
    function pauseContract() public onlyAdmin {
        contractPaused = true;
        emit ContractPaused(msg.sender);
    }

    // Function to unpause the contract
    function unpauseContract() public onlyAdmin {
        contractPaused = false;
        emit ContractUnpaused(msg.sender);
    }
}

