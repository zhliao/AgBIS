import React, { Component } from 'react'

export default class PayIndemnity extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    payIndemnity = async () => {
        const {farmerName} = this
        const {farmlandNumber} = this
        const {amount} = this
        try {
            let res = await this.props.contract.methods.payIndemnity(farmerName.value, farmlandNumber.value)
            .call({ from: this.state.account, value: amount.value})
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    
    render() {
        return (
            <div>
                <h2>Pay Indemnity to Farmer</h2>
                <input ref={c => this.farmerName = c} type="string" placeholder="Farmer's Name" />
                <input ref={c => this.farmandNumber = c} type="string" placeholder="Farmland Number" />
                <input ref={c => this.amount = c} type="string" placeholder="Indemnity Amount" />
                <button onClick={this.payIndemnity}>Pay Indemnity</button>
            </div>
        )
    }
}
