import React, { Component } from 'react'

export default class ReportAcreage extends Component {

    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    reportAcreage = async () => {
        const {farmlandNumber} = this
        const {acreage} = this

        console.log("farmlandNumber is: ", farmlandNumber.value);
        console.log("acreage is: ", acreage.value);
    }
    render() {
        return (
            <div>
                <h2>Report Acreage</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
				<input ref={c => this.acreage = c} type="string" placeholder="Acreage" />
				
				<br />
				<button onClick={this.reportAcreage}>Report Acreage</button>
            </div>
        )
    }
}
