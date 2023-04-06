import React, { Component } from 'react'

export default class SubmitInvestigation extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            policies: ""
		}
	}

    submitFeedback = async () => {
        const {adjusterName} = this
        const {farmerName} = this
        const {farmlandNumber} = this

        const {method} = this
        const {replanting} = this
        const {replantingPayment} = this

        const {rowWidth} = this
        const {rowLength} = this
        const {growthStage} = this

        const {damageType} = this
        const {standReduction} = this
        const {maturityLineWeight} = this
        //prepare data
        var investigationRecord = {};
        investigationRecord.adjusterName = adjusterName.value;
        investigationRecord.farmerName = farmerName.value;
        investigationRecord.farmlandNumber = farmlandNumber.value;

        investigationRecord.method = method.value;
        investigationRecord.replanting = replanting.value;
        investigationRecord.replantingPayment = replantingPayment.value;

        investigationRecord.rowWidth = rowWidth.value;
        investigationRecord.rowLength = rowLength.value;
        investigationRecord.growthStage = growthStage.value;

        investigationRecord.damageType = damageType.value;
        investigationRecord.standReduction = standReduction.value;
        investigationRecord.maturityLineWeight = maturityLineWeight.value;

        // push result to IPFS & submit cid to blockchain
        await this.props.ipfs.add(Buffer(JSON.stringify(investigationRecord)), (error, result) => {
			console.log('Ipfs result', result)

			if (error) {
				console.error(error)
				return
			}

			// Store hash on Blockchain
			this.props.contract.methods.addFeedback(result[0].hash).send({ from: this.props.account })
		})
    }

    render() {
        return (
            <div>
                <h2>Submit Investigation Result</h2>
                <br />
                <p>General Information</p>
                <input ref={c => this.adjusterName = c} type="string" placeholder="Adjuster Name" />
                <input ref={c => this.farmerName = c} type="string" placeholder="Farmer Name" />
				<input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland number" />
                <br />
                <br />
                <p>Replanting Procedures</p>
                <input ref={c => this.method = c} type="string" placeholder="Appraisal for Sample" />
                <input ref={c => this.replanting = c} type="string" placeholder="Replanting (Y/N)" />
                <input ref={c => this.replantingPayment = c} type="string" placeholder="Replanting payment(0 if N)" />
                <br />
                <br />
                <p>Growth Information</p>
                <input ref={c => this.rowWidth = c} type="string" placeholder="Row Width (inches)" />
                <input ref={c => this.rowLength = c} type="string" placeholder="Row Length (inches)" />
                <input ref={c => this.growthStage = c} type="string" placeholder="Growth Stage" />
                <br />
                
                <input ref={c => this.damageType = c} type="string" placeholder="Damage Type" />
                <input ref={c => this.standReduction = c} type="string" placeholder="Stand Reduction" />
                <input ref={c => this.maturityLineWeight = c} type="string" placeholder="Maturity Line Weight (bu/ac)" />
                <br />
                
                <br />
                <button onClick={this.submitFeedback}>Submit Investigation Result</button>
            </div>
        )
    }
}
