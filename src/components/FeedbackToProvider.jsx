import React, { Component } from 'react'

export default class FeedbackToProvider extends Component {
    constructor(props) {
        super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            feedback:""
		}
    }

    submitFeedback = async() => {
        const {agentName} = this
        const {feedbackTextArea} = this
        console.log("New feedback is: ", feedbackTextArea.value); 

        //retreive latest record
        let res = await this.props.contract.methods.viewFeedback(agentName.value)
        .call({ from: this.props.account})
        let cid = res[res.length - 1]
        console.log("retrieved CID is: ", cid);
        
        let oldFeedback = await this.props.ipfs.cat(cid)
        console.log("Returned feedback is: ",oldFeedback);

        //add new practice
		var record = JSON.parse(oldFeedback)
		console.log("Parsing result is: ", record);
		var newFeedback = {
			"date": new Date().toLocaleDateString(),
            "agent": agentName.value,
			"input": feedbackTextArea.value
		}
		record.practices.push(newFeedback)

        //Put file on IPFS
		await this.props.ipfs.add(Buffer(JSON.stringify(record)), (error, result) => {
			console.log('Submit to', result)

			if (error) {
				console.error(error)
				return
			}

			// Store hash on Blockchain
			this.props.contract.methods.addFeedback(result[0].hash)
            .send({ from: this.props.account })
		})



        // var JSONRecord = JSON.stringify(claimInfo.value) 
        // await this.props.ipfs.add(Buffer(JSONRecord), (error, result) => {
		// 	if (error) {
		// 		console.error(error)
		// 		return
		// 	} else {
        //         console.log('Ipfs result', result)
        //         // Store new policy on Blockchain
        //         this.props.contract.methods.claimLoss(
        //             farmlandNumber.value,
        //             result[0].hash)
        //         .send({ 
        //             from: this.props.account
        //         })
        //         }			
		// })

    }
    render() {
        return (
            <div>
                <h2>Feedback To Provider</h2>
                <input ref={c => this.agentName = c} type="string" placeholder="Agent Name" />
                <br />
                <textarea ref={c => this.feedbackTextArea = c} rows = '8' cols = '50' placeholder="Please input feedback here" ></textarea>
                <br />
                <button onClick={this.submitFeedback}>Submit Feedback</button>
            </div>
        )
    }
}
