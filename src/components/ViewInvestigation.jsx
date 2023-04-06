import React, { Component } from 'react'

export default class ViewInvestigation extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            investigationInfo:""
		}
	}

    retrieveClaim = async () => {
		console.log("retrieve practice data")
        const {farmlandNumber} = this
		const policy = await this.props.contract.methods.viewPurchasedPolicy(farmlandNumber.value).call({from: this.state.account})
        console.log(policy)
        let cid = policy.investigationContent;
		// let cid = 'QmVVDoqGkZpWgLUYtW4ZZAiLL8WXnewTY8mSCYSQBEKrhX'
        cid = 'QmNoRoYxt6QvTRmrDp7S1vmDcoXWD16PhNNm4DDxUr81Wi'
        // url: https://ipfs.infura.io/ipfs/cid
		console.log("retrieved CID is: ", cid);
		const investigationInfo = await this.props.ipfs.cat(cid)
        this.setState({investigationInfo});
	}

    render() {
        return (
            <div>
                <h2>View Investigation Result</h2>
				<input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland number" />
                <br />
                <button onClick={this.retrieveClaim}>View Investigation Result</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.investigationInfo} 
                placeholder="The investigation result is: " ></textarea>
                <br />
                
            </div>
        )
    }
}
