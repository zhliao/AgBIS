import React, { Component } from 'react'

export default class HelpPurchasePolicy extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
		}
    }

    purchaseInsurance = async () => {
        
    }
    render() {
        return (
            <div>
                <h2>Purchse Insurance Policy for Farmer</h2>
				<input ref={c => this.farmerName = c} type="string" placeholder="Farmer's Name" />
				<input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland number" />
                <input ref={c => this.farmlandNinsuranceType = c} type="string" placeholder="Insurance Type" />
				<br />
				<button onClick={this.purchaseInsurance}>Purchase Insurance Policy</button>  
            </div>
        )
    }
}
