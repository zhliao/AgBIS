import React, { Component } from 'react'

export default class ViewPurchasedPolicy extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            policyInfo:""
		}
	}

    viewPurchasedPolicy = async () => {
        const {farmlandNumber} = this
		const policy = await this.props.contract.methods.viewPurchasedPolicy(farmlandNumber.value).call({from: this.props.account})
        console.log(policy)
        const plantDate = new Date(policy.plantDate * 1000).toISOString().slice(0, 10)
        
        let policyState
        switch (policy.policyState) {
            case "0":
                policyState = "Invalid";
                break;
            case "1":
                policyState = "Purchased";
                break;
            case "2":
                policyState = "Claimed";
                break;
            case "3":
                policyState = "Dispatched";
                break;
            case "4":
                policyState = "Finished";
                break;
            case "5":
                policyState = "Paid";
                break;
            default:
                console.log("error");
        }
        let policyInfo = []
        const policyDetail = {
            "policy name ": policy.policyName,
            "farmer name ": policy.farmerName,
            "provider name ": policy.providerName,
            "farmland number ": policy.farmlandNumber,
            "coverage level ": policy.coverageLevel,
            "acreage ": policy.acreage,
            "plant date ": plantDate,
            "production per acre ": policy.productionPerAcre,
            "policy status ": policyState,
            // "claim record": 
            // "investigation record": 
        }
        policyInfo.push(policyDetail)
        policyInfo ="[\n" + policyInfo.map(entry => JSON.stringify(entry)).join(",\n") + "\n]"
        

        this.setState({policyInfo});
	}

    viewPurchasedPolicyStatus = async () => {
        const {farmlandNumber} = this
		let policy = await this.props.contract.methods.viewPurchasedPolicy(farmlandNumber.value).call({from: this.props.account})
        console.log(policy)

        let policyState
        switch (policy.policyState) {
            case "0":
                policyState = "Invalid";
                break;
            case "1":
                policyState = "Purchased";
                break;
            case "2":
                policyState = "Claimed";
                break;
            case "3":
                policyState = "Dispatched";
                break;
            case "4":
                policyState = "Finished";
                break;
            case "5":
                policyState = "Paid";
                break;
            default:
                console.log("error");
        }
        const policyInfo = `Policy Status: ${policyState}`;

        this.setState({policyInfo});
	}

    render() {
        return (
            <div>
                <h2>View Purchased Policy</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
                <button onClick={this.viewPurchasedPolicy}>View Policy</button>
                <button onClick={this.viewPurchasedPolicyStatus}>View Policy Status</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.policyInfo}></textarea>
                <br />
            </div>
        )
    }
}
