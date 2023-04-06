import React, { Component } from 'react'

export default class CalculateIndemnity extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            indemnityAmount: ""
		}
	}
    calculateIndemnity = async () => {
        let indemnityAmount = {}
        const {farmlandNumber} = this
        // const {price} = this
        try {
            let res = await this.props.contract.methods.viewPurchasedPolicy(farmlandNumber.value)
            .call({ from: this.props.account })

            indemnityAmount = res.coverageLevel;
            // const coverageLevel = res.coverageLevel;
            // const acreage = res.acreage;
            // const productionPerAcre = res.productionPerAcre
            // const APHYield = res.APHYield
            // indemnityAmount = (coverageLevel * APHYield - productionPerAcre * acreage) * price.value;
        } catch (error) {
            console.log(error);
        }

        this.setState({indemnityAmount})
    }
    render() {
        return (
            <div>
                <h2>Calculate Indemnity</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
                {/* Projected/Harvest price */}
                <input ref={c => this.price = c} type="string" placeholder="Harvest Price (wei)" /> 
                <button onClick={this.calculateIndemnity}>Calculate Indemnity</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '3' cols = '50' value = {this.state.indemnityAmount}></textarea>
            </div>
        )
    }
}
