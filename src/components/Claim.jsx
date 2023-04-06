import React, { Component } from 'react'

export default class Claim extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    claim = async () => {
        const {farmlandNumber} = this
        const {claimInfo} = this
        console.log(claimInfo.value);    
        var JSONRecord = JSON.stringify(claimInfo.value)   

        await this.props.ipfs.add(Buffer(JSONRecord), (error, result) => {
			if (error) {
				console.error(error)
				return
			} else {
                console.log('Ipfs result', result)
                // Store new policy on Blockchain
                this.props.contract.methods.claimLoss(
                    farmlandNumber.value,
                    result[0].hash)
                .send({ 
                    from: this.props.account
                })
                }			
		})
    }

    render() {
        return (
            <div>
                <h2>Claim Loss</h2>
                <input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland Number" />
                <br />
                <textarea ref={c => this.claimInfo = c} rows = '8' cols = '50' placeholder="Please input claim info here"></textarea>
                <br />
                <button onClick={this.claim}>Submit Claim</button>
            </div>
        )
    }
}
