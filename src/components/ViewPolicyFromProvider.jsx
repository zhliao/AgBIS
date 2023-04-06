import React, { Component } from 'react'

export default class ViewPolicySoldByProvider extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            policies: ""
		}
	}

    retrievePolicies = async () => {
        let policyInfo = []
        const {providerName} = this
        try {
            const res = await this.props.contract.methods.viewSoldPoliciesByProvider(providerName.value)
           .call({ from: this.props.account })
        //    policyInfo ="[\n" + res.join(",\n") + "\n]"
        console.log(res);
        } catch (error) {
            console.log(error);
        }

        this.setState({policyInfo})
    }
    render() {
        return (
            <div>
                <h2>View Sold Policies</h2>
                <input ref={c => this.providerName = c} type="string" placeholder="My Name" />
                <button onClick={this.retrievePolicies}>View Policies</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.policies}></textarea>
            </div>
        )
    }
}
