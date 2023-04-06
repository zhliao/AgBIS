import React, { Component } from 'react'

export default class ReportPlantDate extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    reportPlantDate = async () => {
        const plantDateInt = Math.floor(new Date().getTime()/1000)
        const plantDate = new Date(plantDateInt * 1000).toISOString().slice(0, 10)
        console.log("plant date is: ", plantDate);
    }
    render() {
        return (
            <div>
                <h2>Report Plant Date</h2>
				
				<br />
				<button onClick={this.reportPlantDate}>Report Plant Date</button>
            </div>
        )
    }
}
