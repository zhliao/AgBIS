import React, { Component } from 'react'

export default class AssignClaim extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    assignClaim = async () => {
        const {farmlandNumber} = this
        const {adjusterName} = this
        try {
            let res = await this.props.contract.methods.assignClaim(farmlandNumber.value, adjusterName.value)
            .call({ from: this.state.account })
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        return (
            <div>
                <h2>Assign Claim to Adjuster</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
                {/* Projected/Harvest price */}
                <input ref={c => this.adjusterName = c} type="string" placeholder="Adjuster Name" /> 
                <br />
                <button onClick={this.assignClaim}>Assign Claim</button>
            </div>
        )
    }
}
