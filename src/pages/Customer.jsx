import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ViewAllAvailablePolicies from '../components/ViewAllAvailablePolicies'
import PurchaseInsurance from '../components/PurchaseInsurance'
import ViewPurchasedPolicy from '../components/ViewPurchasedPolicy'
import ReportPlantDate from '../components/ReportPlantDate'
import ReportAcreage from '../components/ReportAcreage'
import ReportProduction from '../components/ReportProduction'
import ViewBalance from '../components/ViewBalance'
import AddFarmingPractice from '../components/AddFarmingPractice'
import Claim from '../components/Claim'
import ViewInvestigation from '../components/ViewInvestigation'
export default class Customer extends Component {
    
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
                <h2 className="text-center">Customer</h2>
                <br />
                <ViewAllAvailablePolicies web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <PurchaseInsurance        web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewPurchasedPolicy      web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <ReportPlantDate          web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <ReportAcreage            web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <AddFarmingPractice       web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ReportProduction         web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <ViewBalance              web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <Claim                    web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs} />
                <br />
                <ViewInvestigation        web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                


                <li className="text-center"><Link to="/">Home</Link></li>
            </div>
        )
    }
}