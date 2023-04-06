import React, { Component } from 'react'

export default class ViewFarmingPractice extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            practiceInfo:""
		}
	}

    retrievePractice = async () => {
		console.log("retrieve practice data")
        let practiceInfo = {}
        const {farmlandNumber} = this
        try {
    		let cid = await this.props.contract.methods.viewLastPracticeRecord(farmlandNumber.value).call({ from: this.state.account })
		    // let cid = 'QmVVDoqGkZpWgLUYtW4ZZAiLL8WXnewTY8mSCYSQBEKrhX'
		    console.log("retrieved CID is: ", cid);
            practiceInfo = await this.props.ipfs.cat(cid)
        } catch (error) {
            console.log(error);
        }
         
        this.setState({practiceInfo});
	}


    render() {
        return (
            <div>
                <h2>View Farming Practice</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
                <button onClick={this.retrievePractice}>View Full Practice Records</button>
                <br />
                <textarea ref={c => this.recordTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.practiceInfo}></textarea>
            </div>
        )
    }
}
