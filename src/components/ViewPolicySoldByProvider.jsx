import React, { Component } from 'react'

export default class PublishPolicy extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            policyInfo: ""
		}
    }



    viewByProvider = async () => {
        let policyInfo = []
        const {providerName} = this
        try {
            const res = await this.props.contract.methods.viewSoldPoliciesByProvider(providerName.value)
           .call({ from: this.props.account })
           policyInfo ="[\n" + res.map(entry => JSON.stringify(entry)).join(",\n") + "\n]"
        } catch (error) {
            console.log(error);
        }

        this.setState({policyInfo})
    } 

    render() {
        return (
            <div>
                <h2>View Policies Sold by Each Provider</h2> 
                <input ref={c => this.providerName = c} type="string" placeholder="Provider Name" />
                <br />
                <button onClick={this.viewByProvider}>View Sold Policies</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.policyInfo}></textarea>
            </div>
        )
    }
}
