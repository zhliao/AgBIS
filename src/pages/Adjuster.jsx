import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import ViewWorkload from '../components/ViewWorkload';
import ViewFarmingPractice from '../components/ViewFarmingPractice';
import RequestWeatherData from '../components/RequestWeatherData';
import SubmitInvestigation from '../components/SubmitInvestigation';

export default class Adjuster extends Component {
    
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
                <h2 className="text-center">Adjuster</h2>
                <br />
                <ViewWorkload        web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <ViewFarmingPractice web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <RequestWeatherData/>
                <SubmitInvestigation web3={this.props.web3} contract={this.props.contract} account={this.props.account} ipfs={this.props.ipfs}/>
                <br />
                <li className="text-center"><Link to="/">Back to Home</Link></li>
            </div>
        )
    }
}
