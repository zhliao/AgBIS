import React, { Component } from 'react'

export default class AddAgent extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    addAgent = async () => {    
        const {agentName} = this
        const {agentAddress} = this   
        try {
            let res = await this.props.contract.methods.addAgent(agentName.value, agentAddress.value)
           .send({ from: this.props.account })
           console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <h2>Add Insurance Agent</h2>
                <input ref={c => this.agentName = c} type="string" placeholder="Agent Name" />
                <input ref={c => this.agentAddress = c} type="string" placeholder="Agent Address" />
                <br />
                <button onClick={this.addAgent}>Add Insurance Adjuster</button> 
            </div>
        )
    }
}
