import React, { Component } from 'react'

export default class AddFarmingPractice extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
    }
    updatePractice = async () => {
		console.log("retrieve data")
        const {inputType} = this
        const {inputAmount} = this
        const {inputFarmlandNumber}  = this
		var cid = await this.props.contract.methods.viewLastPracticeRecord(inputFarmlandNumber.value).call({ from: this.props.account })
		// let cid = 'QmVVDoqGkZpWgLUYtW4ZZAiLL8WXnewTY8mSCYSQBEKrhX'
		console.log("retrieved CID is: ", cid);

		const fileContents = await this.props.ipfs.cat(cid)
		console.log("Returned result is: ", fileContents)

        //add new practice
		var record = JSON.parse(fileContents)
		console.log("Parsing result is: ", record);
		var newPractice = {
			"date": new Date().toLocaleDateString(),
			"input": inputType.value,
			"amount": inputAmount.value
		}
		record.practices.push(newPractice)

        //Put file on IPFS
		await this.props.ipfs.add(Buffer(JSON.stringify(record)), (error, result) => {
			console.log('Ipfs result', result)

			if (error) {
				console.error(error)
				return
			}

			// Store hash on Blockchain
			this.props.contract.methods.addPracticeRecord(result[0].hash, inputFarmlandNumber.value).send({ from: this.props.account })
		})
	}

    render() {
        return (  
            <div>
                <h2>Add Farming Practice</h2>
                <input ref={c => this.inputFarmlandNumber = c} type="string" placeholder="Farmland Number" />
				<input ref={c => this.inputType = c} type="string" placeholder="Input type" />
				<input ref={c => this.inputAmount = c} type="string" placeholder="Input amount" />
				<br />
				<button onClick={this.updatePractice}>Add Practice</button>
            </div>
        )
    }
}
