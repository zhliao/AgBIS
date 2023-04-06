import React, { Component } from 'react'

export default class AddProvider extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            policyInfo: "",
            providerNameList:""
		}
    }



    addProvider = async () => {
        const {providerName} = this
        const {providerAddr} = this

        try {
            await this.props.contract.methods.addProvider(providerName.value, providerAddr.value)
           .send({ from: this.props.account })
        } catch (error) {
            console.log(error);
        }
    } 

    
    viewProviders = async () => {
        let providerNameList = {}
        try {
            const res = await this.props.contract.methods.viewProviders()
           .call({ from: this.props.account })
           providerNameList ="[\n" + res.map(entry => JSON.stringify(entry)).join(",\n") + "\n]"
        } catch (error) {
            console.log(error);
        }

        
        this.setState({providerNameList})
    }

    render() {
        return (
            <div>
                <h2>Add New Insurance Provider</h2> 
                <input ref={c => this.providerName = c} type="string" placeholder="Provider Name" />
                <input ref={c => this.providerAddr = c} type="string" placeholder="Provider Address" />
                <br />
                <button onClick={this.addProvider}>Add New Provider</button>
                <br /> <br />
                <button onClick={this.viewProviders}>View Providers</button>
                <br />
                <textarea ref={c => this.providerTextArea = c} readOnly rows = '5' cols = '40' value = {this.state.providerNameList}></textarea>
            </div>
        )
    }
}
