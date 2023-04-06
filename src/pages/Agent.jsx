import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ViewAllAvailablePolicies from '../components/ViewAllAvailablePolicies'
import PurchaseInsurance from '../components/PurchaseInsurance'
import FeedbackToProvider from '../components/FeedbackToProvider'

export default class Agent extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account
		}
	}

    render() {
        return (
            <div>
                <h2 className="text-center">Agent</h2>
                <ViewAllAvailablePolicies web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <PurchaseInsurance        web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <FeedbackToProvider       web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <li className="text-center"><Link to="/">Back to Home</Link></li>
            </div>
        )
    }
}
