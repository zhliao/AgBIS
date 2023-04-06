import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import PublishPolicy from '../components/PublishPolicy'
import AddProvider from '../components/AddProvider'
import ViewPolicySoldByProvider from '../components/ViewPolicySoldByProvider'

export default class FCIC extends Component {
    
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    viewBalance = async () => {
        const balance = await this.props.web3.eth.getBalance(this.props.account);
        console.log("balance: ", balance);
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Regulatory Authority</h2>
                <PublishPolicy            web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <AddProvider              web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewPolicySoldByProvider web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <li className="text-center"><Link to="/">Back to Home</Link></li>
            </div>
        )
    }
}