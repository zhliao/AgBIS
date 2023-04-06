import React, { Component } from 'react'

export default class ViewClaim extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs,
            claimInfo:""
		}
	}

    retrieveClaim = async () => {
		console.log("retrieve claim data")
        let claimInfo = {}
        try {
            let claimInfo = await this.props.contract.methods.viewClaimedPolicy()
            .call({ from: this.props.account })

            console.log(claimInfo);
        } catch (error) {
            console.log(error);
        }

        this.setState({claimInfo});
	}



    render() {
        return (
            <div>
                <h2>View Claimed Policies</h2>
                
                <button onClick={this.retrieveClaim}>View Claimed Policies</button>
                <br />
                <textarea ref={c => this.recordTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.claimInfo}></textarea>
            </div>
        )
    }
}
