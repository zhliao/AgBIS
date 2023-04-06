import React, { Component } from 'react'

export default class AddAdjuster extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    addAdjuster = async () => { 
        const {adjusterName} = this
        const {adjusterAddress} = this

        try {
            let res = await this.props.contract.methods.addAdjuster(adjusterName.value, adjusterAddress.value)
            .send({ from: this.props.account })
            console.log(res);
        } catch (error) {
            console.log(error);
        }

    
    }



    render() {
        return (
            <div>
                <h2>Add Insurance Adjuster</h2>
                <input ref={c => this.adjusterName = c} type="string" placeholder="Adjuster Name" />
                <input ref={c => this.adjusterAddress = c} type="string" placeholder="Adjuster Address" />
                <br />
                <button onClick={this.addAdjuster}>Add Insurance Adjuster</button>   
            </div>
        )
    }
}
