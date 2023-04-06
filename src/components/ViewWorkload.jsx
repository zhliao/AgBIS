import React, { Component } from 'react'

export default class ViewWorkload extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            policyList:""
		}
	}
    checkWork = async () => {
        let policyList = []
        try {
            let res = this.props.contract.methods.viewWorkload().call({from: this.props.account})
            console.log(res);
            console.log(res.length);
            for (let i = 0; i < res.length; i++) {
                // console.log(res[i].policyName);
                const policy = {
                    "policy name ": res[i].policyName,
                    "farmer name ": res[i].farmerName,
                    "provider name ": res[i].providerName,
                    "farmland number ": res[i].farmlandNumber,
                    "coverage level ": res[i].coverageLevel,
                    "acreage ": res[i].acreage,
                    "plant date ": res[i].plantDate,
                    "production per acre ": res[i].productionPerAcre,
                    "policy status ": res[i].policyState,
                }
                policyList.push(policy)
                
            }
                
                // policyList = JSON.stringify(policyList)
                policyList ="[\n" + policyList.map(entry => JSON.stringify(entry)).join(",\n") + "\n]"
                console.log(policyList);
        } catch (error) {
            console.log(error);
        }
        
        
        this.setState({policyList})
    }
    render() {
        return (
            <div>
                <h2>View My Workload</h2>
                <button onClick={this.checkWork}>View Policy</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.policyList}></textarea>
            </div>
        )
    }
}
