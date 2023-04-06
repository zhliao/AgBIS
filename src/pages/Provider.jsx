import React, { Component } from 'react'
import { Link } from 'react-router-dom'


import ViewPolicyFromProvider from '../components/ViewPolicyFromProvider'
import CalculateIndemnity from '../components/CalculateIndemnity'
import ViewFarmingPractice from '../components/ViewFarmingPractice'
import AddAdjuster from '../components/AddAdjuster'
import AddAgent from '../components/AddAgent'
import PayIndemnity from '../components/PayIndemnity'
import CollectFeedback from '../components/CollectFeedback'
import ViewInvestigation from '../components/ViewInvestigation'
import ViewClaim from '../components/ViewClaim'
import AssignClaim from '../components/AssignClaim'
export default class Provider extends Component {

    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: this.props.ipfs
		}
	}

    render() {
        return (
            <div>
                <h2 className="text-center">Provider</h2>
                <br />
                <ViewPolicyFromProvider web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <AddAdjuster            web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <AddAgent               web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewClaim              web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewFarmingPractice    web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <AssignClaim            web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewInvestigation      web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br /> 
                <CalculateIndemnity     web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br /> 
                <PayIndemnity           web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <CollectFeedback        web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />

                <li className="text-center"><Link to="/">Home</Link></li>
            </div>
        )
    }
}