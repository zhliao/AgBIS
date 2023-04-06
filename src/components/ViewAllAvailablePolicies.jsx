import React, { Component } from 'react'



export default class ViewAllAvailablePolicies extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            policyList: undefined
		}
    }

    viewAllAvailablePolicies = async () => {
        let policyList = []
        try {
            const res = await this.props.contract.methods.viewAvailablePolicies().call({from: this.props.account})
            console.log(res);
            console.log(res.length);
            for (let i = 0; i < res.length; i++) {
                // console.log(res[i].policyName);
                const policy = {
                    "name": res[i].policyName,
                    "description": res[i].description,
                    "max coverage level": res[i].maxCoverageLevel,
	                "min coverage level": res[i].minCoverageLevel,
	                "sales closing date": new Date(res[i].salesClosingDate * 1000).toISOString().slice(0, 10),
                    "final planting date": new Date(res[i].finalPlantingDate * 1000).toISOString().slice(0, 10),
                    "acreage reporting date": new Date(res[i].acreageReportingDate * 1000).toISOString().slice(0, 10),
                    "production reporting date": new Date(res[i].productionReportingDate * 1000).toISOString().slice(0, 10),
	                "premium amount (wei)": res[i].premiumAmount
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
        

        // new Date(time * 1000).toISOString().slice(0, 19).replace('T', ' ')
    }

    render() {
        return (
            <div>
                <h2>View All Available Policies</h2>
                <button onClick={this.viewAllAvailablePolicies}>Request All Available Policies</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '70' value = {this.state.policyList}></textarea>
            </div>
        )
    }
}
