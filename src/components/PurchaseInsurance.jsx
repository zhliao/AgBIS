import React, { Component } from 'react'

export default class PurchaseInsurance extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
    }

    purchaseInsurance = async (event) => {
        event.preventDefault()

        const {policyName} = this
		const {farmerName} = this
        const {providerName} = this
		const {farmlandNumber} = this
        const {coverageLevel} = this
        const {premium} = this

        const today = Math.floor(new Date().getTime()/1000)
        // const startDate = Math.floor((today.getTime() / 1000));
        // const end = new Date(today.setFullYear(today.getFullYear() + 1))
        // const endDate = Math.floor((end.getTime() / 1000));
        // another way
        // new Date(2010, 6, 26).getTime() / 1000

        //Build new practice record      
        var record = {};
		record.owner = farmerName.value
		record.farmlandNumber = farmlandNumber.value
		record.practices = []
        var JSONRecord = JSON.stringify(record)
     
        //upload record to IPFS
        console.log("Submitting file to ipfs...")
        
        await this.props.ipfs.add(Buffer(JSONRecord), (error, result) => {
			if (error) {
				console.error(error)
				return
			} else {
                console.log('Ipfs result', result)
                // Store new policy on Blockchain

                this.props.contract.methods.purchasePolicy(
                    today, 
                    policyName.value,
                    farmerName.value, 
                    providerName.value,
                    farmlandNumber.value, 
                    coverageLevel.value,
                    result[0].hash)
                .send({ 
                    from: this.props.account, 
                    value: premium.value
                })
                }			
		})
	}

    render() {
        return (
            <div>
                <h2>Purchase Insurance Policy</h2>
                <input ref={c => this.policyName = c} type="string" placeholder="Policy Name" />
                <input ref={c => this.farmerName = c} type="string" placeholder="Farmer Name" />
                <input ref={c => this.providerName = c} type="string" placeholder="Provider Name" />
                <br />
				<input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland number" />
                <input ref={c => this.coverageLevel = c} type="string" placeholder="Coverage Level" />
                <input ref={c => this.premium = c} type="string" placeholder="Premium (wei)" />
				<br />
				<button onClick={this.purchaseInsurance}>Purchase Insurance Policy</button>   
            </div>
        )
    }
}
