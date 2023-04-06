import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'
import Web3 from 'web3'
import CropInsurance from './abis/CropInsurance.json'
import Header from './components/Header'
import FCIC from './pages/FCIC'
import Provider from './pages/Provider'
import Customer from './pages/Customer'
import Home from './pages/Home'
import Adjuster from './pages/Adjuster'
import Agent from './pages/Agent'

// var BigNumber = require('bignumber.js');

export default class App extends Component {


    async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
        await this.loadIpfs()
	}


	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3
		// Load current metamask account
		const accounts = await web3.eth.getAccounts()
        this.setState({web3: web3})
		this.setState({ account: accounts[0] })
		const networkId = await web3.eth.net.getId()
		const networkData = CropInsurance.networks[networkId]
		if (networkData) {
			const contract = new web3.eth.Contract(CropInsurance.abi, networkData.address)
			this.setState({ contract })
		} else {
			window.alert('Smart contract not deployed to detected network.')
		}
	}

    async loadIpfs() {
        const ipfsClient = require('ipfs-http-client')
        const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
        const apiKey = '6aa7887c25a4359416324cf577d324ec';
        // console.log('current ipfs is: ', ipfs);
        this.setState({ipfs})
        this.setState({apiKey})
    }

    constructor(props) {
		super(props)

		this.state = {
			contract: null,
			web3: null,
			account: null,
            ipfs: null,
            apiKey: null
		}
	}


    render() {
        return (
            <div>
                <div className="row">
                    <div className=" col-12">
						<Header/>
					</div>
                </div>

                <div className="row">
					<div className="col-12">
						<div className="panel">
							<div className="panel-body">
                                {/* Route matchers: A <Switch> looks through its children <Route>s and
                                renders the first one that matches the current URL. */}
                                <Switch>
                                    <Route path="/fcic" ><FCIC         web3={this.state.web3} contract={this.state.contract} account={this.state.account} ipfs={this.state.ipfs}/></Route>
                                    <Route path="/provider" ><Provider web3={this.state.web3} contract={this.state.contract} account={this.state.account} ipfs={this.state.ipfs}/></Route>
                                    <Route path="/customer" ><Customer web3={this.state.web3} contract={this.state.contract} account={this.state.account} ipfs={this.state.ipfs}/></Route>
                                    <Route path="/adjuster" ><Adjuster web3={this.state.web3} contract={this.state.contract} account={this.state.account} ipfs={this.state.ipfs}/></Route>
                                    <Route path="/agent" ><Agent       web3={this.state.web3} contract={this.state.contract} account={this.state.account} ipfs={this.state.ipfs}/></Route>
                                    <Route path="/" ><Home/></Route>
                                </Switch>
							</div>
						</div>
					</div>
				</div>

            </div>
        )
    }
}