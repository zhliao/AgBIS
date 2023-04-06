import React, { Component } from 'react'

export default class CollectFeedback extends Component {
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
    collectFeedback = async () => {
        let feedback = {}
        const {agentName} = this
        try {
            let res = await this.props.contract.methods.viewFeedback(agentName.value)
            .call({ from: this.state.account})
            let cid = res[res.length - 1]
            console.log("retrieved CID is: ", cid);
            feedback = await this.props.ipfs.cat(cid)
            console.log(res);
        } catch (error) {
            console.log(error);
        }

        this.setState({feedback})
    }
    render() {
        return (   
            <div>
                <h2>Collect Feedback From Agent</h2>
                <input ref={c => this.agentName = c} type="string" placeholder="Agent's Name" />
                <button onClick={this.collectFeedback}>Collect Feedback</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.feedback} 
                placeholder="Agent's feedback" ></textarea>
                <br />
                
            </div>
        )
    }
}
