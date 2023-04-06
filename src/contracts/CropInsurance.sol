// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.5 <=0.8.0;

 contract CropInsurance {
    /*
	* State Variables
	*/
	// Stores the policy state
	enum PolicyState { Invalid, Purchased, Claimed, Dispatched, Finished, Paid }

	//Define available policy 
	struct AvailablePolicy {
	    string policyName;
	    string description;
	    string maxCoverageLevel;
	    string minCoverageLevel;
	    int salesClosingDate;
        int finalPlantingDate;
        int acreageReportingDate;
        int productionReportingDate;
	    int premiumPerAcre;
	}

    struct Farmland {
	    int farmlandId;
	    string owner;
	    int APHYield;
	    int acreage;
	}
	
	// Stores a struct that represents a flight insurance policy
	struct Policy {
        string policyName;
        string farmerName;
	    string providerName;
	    int farmlandId;
	    string coverageLevel;
	    int plantDate;
	    int plantAcreage;
	    int productionPerAcre;
	    string[] practiceRecords;
	    PolicyState policyState;
        string claimContent;
        string investigationContent;
	}
	
	// map name to AvailablePolicy
	mapping(string => AvailablePolicy) mapNameToAvailablePolicy;
	string[] availablePolicyNameList;
	// map provider name to his address
    mapping(string => address payable) mapProviderNameToAddress;
    string[] providerNameList;
    

	mapping(address => int []) mapFarmerToFarmlandID;
	mapping(address => int[]) mapFarmerToPolicyID;
	// map farmer addr to farmland (farmlandID => farmland)
	mapping(int => Farmland) mapFarmlandIDToFarmland;
	// map farmlandId to policy (farmlandID => policy)
	mapping(int => Policy) mapPolicyIDToPolicy;

	
	// map provider to policyID
	mapping(address => int[]) mapProviderToPolicyID;
	// map provider to adjusters
    mapping(address => string []) mapProviderToAdjusters;
    // map provider to agents
    mapping(address => string []) mapProviderToAgents;
    // map agent & adjuster name to his address
    mapping(string => address) mapStaffNameToAddress;
    
    // mapping farmer name to address
    mapping (string => address payable) mapFarmerNameToAddress;
    // map adjuster address to workload (policyID)
    mapping (address => int[]) mapAdjusterToWorkload;
    // map agent address to feedback (IPFS cid array)
    mapping (address => string[])mapAgentToFeedback;
    
    address regulatoryAuthority;
    /*
	* Constructor
	*/
	constructor() {
        regulatoryAuthority = payable(msg.sender);
    }
    
    modifier onlyFCIC {
        require(msg.sender == regulatoryAuthority, "Not authorized");
        _;
    }
    /*
	* Regulatory Authority Functions
	*/
	// 1.  publish new insurance policy
	function publishNewPolicy(string memory _policyName, string memory _description, string memory _maxCoverageLevel, 
	string memory _minCoverageLevel, int _salesClosingDate, int _finalPlantingDate, 
    int _acreageReportingDate, int _productionReportingDate, int _premiumPerAcre) public onlyFCIC {
        AvailablePolicy memory temp = AvailablePolicy(_policyName, _description, _maxCoverageLevel, _minCoverageLevel, _salesClosingDate,
                                                     _finalPlantingDate, _acreageReportingDate, _productionReportingDate, _premiumPerAcre);
        availablePolicyNameList.push(_policyName);
        mapNameToAvailablePolicy[_policyName] = temp;
                                    
    }
    
    // 2. add insurance provider
    function addProvider (string memory _providerName, address payable _providerAddress) public onlyFCIC {
    	mapProviderNameToAddress[_providerName] = _providerAddress;
        providerNameList.push(_providerName);
    }	 
    
    // 3. view providers
    function viewProviders() public onlyFCIC view returns (string[] memory _name) {
        return providerNameList;
    }
    
    // 4. View policies sold by provider
    function viewSoldPoliciesByProvider(string memory _providerName) public view returns(Policy [] memory _policies) {

        address _providerAddr = mapProviderNameToAddress[_providerName];
        int [] memory policyIDs = mapProviderToPolicyID[_providerAddr];
        Policy [] memory policies = new Policy[](policyIDs.length);
        for (uint i = 0; i < policyIDs.length; i++) {
            Policy memory temp = mapPolicyIDToPolicy[policyIDs[i]];
            policies[i] = temp;
        }
        return policies;
	}
    
    

    /*
	* Farmer Functions
	*/
	// 1. view available policies
	function viewAvailablePolicies () public view returns (AvailablePolicy [] memory _res) {
	    uint len = availablePolicyNameList.length;
	    AvailablePolicy [] memory res = new AvailablePolicy [](len);
	    for (uint i = 0; i < len; i++) {
	        AvailablePolicy memory temp = mapNameToAvailablePolicy[availablePolicyNameList[i]];
	        res[i] = temp;
	    }
	    return res;
	} 
	
	// 2. set farmland
	function setFarmland (int _farmlandId, string memory _owner, int _APHYield, int _acreage) public {
	    Farmland memory temp = Farmland(_farmlandId, _owner, _APHYield, _acreage);
	    mapFarmlandIDToFarmland[_farmlandId] = temp;
	    mapFarmerToFarmlandID[msg.sender].push(_farmlandId);
	}
	
	// 3. view farmland
	function viewFarmland (int _farmlandId) public view returns (Farmland memory farmland){
	    Farmland memory temp = mapFarmlandIDToFarmland[_farmlandId];
	    return temp;
	}
	// 4. purchase policy
	function purchasePolicy (int _today, string memory _policyName, string memory _farmerName, 
    string memory _providerName, int _farmlandId,  string memory _coverageLevel, string memory _PracticeAddr) 
    public payable {
        AvailablePolicy memory temp = mapNameToAvailablePolicy[_policyName];
        require(_today <= temp.salesClosingDate, "Closed");

		Policy storage newPolicy = mapPolicyIDToPolicy[_farmlandId];
		newPolicy.policyName = _policyName;
		newPolicy.farmerName = _farmerName;
        newPolicy.providerName = _providerName;
        newPolicy.farmlandId = _farmlandId;
		newPolicy.coverageLevel = _coverageLevel;
        newPolicy.practiceRecords.push( _PracticeAddr);
		newPolicy.policyState = PolicyState.Purchased;		

		address payable _providerAddress = mapProviderNameToAddress[_providerName];
        mapProviderToPolicyID[_providerAddress].push(_farmlandId);
        mapFarmerToPolicyID[msg.sender].push(_farmlandId);
        mapFarmerNameToAddress[_farmerName] = payable(msg.sender);
		_providerAddress.transfer(msg.value);
    }
    
    // 5. view purchased Policy
    function viewPurchasedPolicy(int _farmlandId) public view returns(Policy memory policy) {
        Policy memory temp = mapPolicyIDToPolicy[_farmlandId];
        return temp;
    }
    
    // 6. report acreage
    function reportAcreage(int _farmlandId, int _acreage) public {
		Policy storage farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
        farmerPolicy.plantAcreage = _acreage;
	}
	
	// 7. report plant date
    function reportPlantDate(int _farmlandId, int _plantDate) public {
		Policy storage farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
        farmerPolicy.plantDate = _plantDate;
	}
	
	// 8. report production per acreage
	    function reportProduction(int _farmlandId, int _productionPerAcre) public {
		Policy storage farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
        farmerPolicy.productionPerAcre = _productionPerAcre;
	}
    
    // 9. add practiceRecord
	function addPracticeRecord(string memory _newPracticeAddr, int _farmlandId) public {
		Policy storage farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
		farmerPolicy.practiceRecords.push( _newPracticeAddr);
	}
	
	// 10. view_lastest_practiceRecord
	function viewLastPracticeRecord(int _farmlandId) public view returns(string memory _lastestRecord) {
	    Policy memory farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
	    uint len = farmerPolicy.practiceRecords.length;
	    return farmerPolicy.practiceRecords[len - 1];
	}
	
	//11. claim_loss
    function claimLoss (int _farmlandId, string memory _claimContent) public {
		Policy storage farmerPolicy = mapPolicyIDToPolicy[_farmlandId];
        farmerPolicy.claimContent = _claimContent;
        farmerPolicy.policyState = PolicyState.Claimed;
    }
    
    /*
	* Provider Functions 
	*/
	// 1. View policies sold by provider
	// function viewSoldPoliciesByProvider
	
	// 2. calculate indemnity
	function calculateIndemnity (int _farmlandId) public view 
    returns (string memory _coverageLevel, int _acreage, int _productionPerAcer) {
        Policy memory policy = mapPolicyIDToPolicy[_farmlandId];
        return (policy.coverageLevel, policy.plantAcreage, policy.productionPerAcre);
    }
    
    // 3. view farmer's practice record
    // function viewLastPracticeRecord(int _farmlandId)
    
    // 4. pay indemnity to the farmer
    function payIndemnity(int _farmlandId) public payable {
        Policy storage policy = mapPolicyIDToPolicy[_farmlandId];
        policy.policyState = PolicyState.Paid;
        address payable _farmerAddress = mapFarmerNameToAddress[policy.farmerName];
        _farmerAddress.transfer(msg.value);
    }
    
    // 5. add insurance agent
    function addAgent(string memory _agentName, address payable _agentAddress) public {
        mapProviderToAgents[msg.sender].push(_agentName);
    	mapStaffNameToAddress[_agentName] = _agentAddress;
    }
    
    // 6. add insurance adjuster
    function addAdjuster(string memory _adjusterName, address payable _adjusterAddress) public {
    	mapProviderToAdjusters[msg.sender].push(_adjusterName);
    	mapStaffNameToAddress[_adjusterName] = _adjusterAddress;
    }
    
    // 7. retrieve claimed policies
    function retrieveClaimedPolicy () public view returns (Policy[] memory claimedPolicyList) {
        int[] memory policyID = mapProviderToPolicyID[msg.sender];
        uint len = policyID.length;
        uint claimCount = 0;
        for (uint i = 0; i < len; i++) {
            Policy memory temp = mapPolicyIDToPolicy[policyID[i]];
            if (temp.policyState == PolicyState.Claimed) {
                claimCount++;
            }
        }
        
        Policy [] memory res = new Policy[](claimCount);
        uint j = 0;
        for (uint i = 0; i < len; i++) {
            Policy memory temp = mapPolicyIDToPolicy[policyID[i]];
            if (temp.policyState == PolicyState.Claimed) {
                res[j] = temp;
                j++;
            }
        }
        
        return res;
    }
    
    // 8. assign workload to adjuster
    function assignWorkload (string memory _adjusterName, int _farmlandId) public {
        mapAdjusterToWorkload[mapStaffNameToAddress[_adjusterName]].push(_farmlandId);
        Policy storage policy = mapPolicyIDToPolicy[_farmlandId];
        policy.policyState = PolicyState.Dispatched;
    }
    
    // 9. view feedback from agent
    function viewFeedback (string memory _agentName) public view returns (string[] memory _feedback) {
        return mapAgentToFeedback[mapStaffNameToAddress[_agentName]];
    }
    
    /*
	* Insurance Adjuster Functions
	*/
    // 1. view_workload
    function viewWorkload () public view returns (Policy[] memory _myWork) {
        int[] memory index = mapAdjusterToWorkload[msg.sender];
        uint len = index.length;
        Policy [] memory res = new Policy[](len);
        for (uint i = 0; i < len; i++) {
            Policy memory temp = mapPolicyIDToPolicy[index[i]];
            res[i] = temp;
        }
        return res;
    }
    
    // 2. add investigation result
    function addInvestigationResult(int _farmlandId, string memory _res) public {
        int[] storage policyID = mapAdjusterToWorkload[msg.sender];
        uint len = policyID.length;
        uint index = 0;
        for (uint i = 0; i < len; i++) {
            if(policyID[i] == _farmlandId) {
                index = i;
                break;
            }
        }
        if (index == len - 1){
            policyID.pop();
        } else {
            for (uint i = index; i < len - 1; i++) {
                policyID[i] = policyID[i+1];
                policyID.pop();
            }
        }
        Policy storage policy = mapPolicyIDToPolicy[_farmlandId];
        policy.investigationContent = _res;
        policy.policyState = PolicyState.Finished;
    } 
    
    /*
	* Insurance Agent Functions (optional agent, could be 3rd party independent agent or insurance company agent)
	*/
	// 1. view_available_policies
    // function viewAvailablePolicies () 

    // 2. Help farmer purchase policy
    // function purchasePolicy
    
    // 3. Feedback to an insurance provider on the specific policy
    function addFeedback(string memory _feedback) public {
        string [] storage temp = mapAgentToFeedback[msg.sender];
        temp.push(_feedback);
    }
}