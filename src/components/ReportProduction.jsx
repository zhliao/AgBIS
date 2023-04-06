import React, { Component } from 'react'

export default class ReportProduction extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    reportProduction = async () => {
        const {farmlandNumber} = this
        const {production} = this

        console.log("farmlandNumber is: ", farmlandNumber.value);
        console.log("production is: ", production.value);
    }
    render() {
        return (
            <div>
                <h2>Report Production per Acre</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
				<input ref={c => this.production = c} type="string" placeholder="Production per Acre" />
				
				<br />
				<button onClick={this.reportProduction}>Report Production</button>
            </div>
        )
    }
}
