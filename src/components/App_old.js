import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import CropInsurance from '../abis/CropInsurance.json'


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
const apiKey = '6aa7887c25a4359416324cf577d324ec';

export default class App extends Component {

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
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
        console.log(accounts);
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

	constructor(props) {
		super(props)

		this.state = {
			contract: null,
			web3: null,
			account: null,
            weatherInfo: "no weather data available",
            practiceInfo:"no practice data available",
            policyInfo:"no policy data available",
            premium: "0.001",
            indemnity: "0.02"
		}
	}
	purchaseInsurance = async (event) => {
        event.preventDefault()

		const {farmerName} = this
		const {farmlandNumber} = this

        const today = new Date()
        const startDate = Math.floor((today.getTime() / 1000));
        const end = new Date(today.setFullYear(today.getFullYear() + 1))
        const endDate = Math.floor((end.getTime() / 1000));
        // another way
        // new Date(2010, 6, 26).getTime() / 1000

        //Build new practice record      
        var record = {};
		record.owner = farmerName.value
		record.farmlandNumber = farmlandNumber.value
		record.practices = []
        var JSONRecord = JSON.stringify(record)
     
        //upload record to IPFS
        console.log("Submitting file to ipfs...")
        await ipfs.add(Buffer(JSONRecord), (error, result) => {
			console.log('Ipfs result', result)

			if (error) {
				console.error(error)
				return
			}

			// Store new policy on Blockchain
            this.state.contract.methods.purchasePolicy(farmerName.value, farmlandNumber.value, startDate, endDate, result[0].hash).send({ from: this.state.account, value: this.state.web3.utils.toWei(this.state.premium, "ether")})
		})
	}

	viewPurchasedPolicy = async () => {
		let policy = await this.state.contract.methods.viewPurchasedPolicy().call({from: this.state.account})
        console.log(policy)
        const farmerName = policy._farmerName
        const farmlandNumber = policy._farmlandNumber
        const startDate = new Date(policy._startDate * 1000).toISOString().slice(0, 10)
        const endDate = new Date(policy._endDate * 1000).toISOString().slice(0, 10)
        let policyState
        switch (policy._policyState) {
            case "0":
                policyState = "Invalid";
                break;
            case "1":
                policyState = "Purchased";
                break;
            case "2":
                policyState = "Claimed";
                break;
            default:
                console.log("error");
        }
        const policyInfo = `
            Name: ${farmerName}
            Farmland Number: ${farmlandNumber}
            Start Date: ${startDate}	
            End Date: ${endDate}
            Policy Status: ${policyState}`;
            this.setState({policyInfo});
	}


	//Example CID: "QmRikQPqmYak3LpYYvTVCcQqQ7XDXoUUgDGGPBUudsS8L5"
	//Example url: "https://ipfs.infura.io/ipfs/QmRikQPqmYak3LpYYvTVCcQqQ7XDXoUUgDGGPBUudsS8L5"
	updatePractice = async () => {
		console.log("retrieve data")
		var cid = await this.state.contract.methods.viewLastPracticeRecord().call({ from: this.state.account })
		// let cid = 'QmVVDoqGkZpWgLUYtW4ZZAiLL8WXnewTY8mSCYSQBEKrhX'
		console.log("retrieved CID is: ", cid);
		const fileContents = await ipfs.cat(cid)
		console.log("Returned result is: ", fileContents)

        //add new practice
		var record = JSON.parse(fileContents)
		console.log("Parsing result is: ", record);
		var newPractice = {
			"date": new Date().toLocaleDateString(),
			"input": this.inputType.value,
			"amount": this.inputAmount.value
		}
		record.practices.push(newPractice)

        //Put file on IPFS
		await ipfs.add(Buffer(JSON.stringify(record)), (error, result) => {
			console.log('Ipfs result', result)

			if (error) {
				console.error(error)
				return
			}

			// Store hash on Blockchain
			this.state.contract.methods.addPracticeRecord(result[0].hash).send({ from: this.state.account })
		})
	}
	retrievePractice = async () => {
		console.log("retrieve practice data")
		let cid = await this.state.contract.methods.viewLastPracticeRecord().call({ from: this.state.account })
		// let cid = 'QmVVDoqGkZpWgLUYtW4ZZAiLL8WXnewTY8mSCYSQBEKrhX'
		console.log("retrieved CID is: ", cid);
		const practiceInfo = await ipfs.cat(cid)
        this.setState({practiceInfo});
	}



    retrieveWeatherData = async () => {
        //The month in Date() is 0-indexed
        var today = new Date(this.year.value, this.month.value - 1, this.day.value);
        var todayUnix = Math.floor((today.getTime() / 1000));
        var lat = this.latitude.value;
        console.log(lat);
        var long = this.longitude.value;
        console.log(long);
        const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${long}&dt=${todayUnix}&appid=${apiKey}`;

        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            let latitude = data.lat > 0? `${data.lat} \u00B0N`:`${-data.lat} \u00B0S`;
            let longitude = data.lon > 0? `${data.lon} \u00B0E`:`${-data.lon} \u00B0W`;
            let hour = data.hourly;
            let stamp = this.hour.value;
            let hourlydata = hour[stamp];
            var UNIX_Timestamp = hourlydata.dt;
            var readableTime = new Date(UNIX_Timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
            const location = `Location: latitude: ${latitude} longitude: ${longitude}`;
            const requestedTime = `Time: ${readableTime}`;
            const temp = `Temperature: ${(hourlydata.temp-273.15).toFixed(2)} \u00B0C`;
            const windSpeed = `Wind speed: ${hourlydata.wind_speed} m/s`;
            const weatherMain = `Weather condition: ${hourlydata.weather[0].main}`;
            const weatherDescription = `Weather description: ${hourlydata.weather[0].description}`;

            const weatherInfo = `
            ${location}
            ${requestedTime}
            ${temp}	
            ${windSpeed}
            ${weatherMain}
            ${weatherDescription}`;
            this.setState({weatherInfo});
            console.log(location);
            console.log(requestedTime);
            console.log(temp);
            console.log(windSpeed);
            console.log(weatherMain);
            console.log(weatherDescription);
        })
        .catch((error) => {
            console.log(error);
        });
    }
	render() {
		return (
			<div>
				<h1>Crop Insurance TEST</h1>
				<br /><br />

				<h2>Purchse/View Insurance Policy</h2>
				<input ref={c => this.farmerName = c} type="string" placeholder="Farmer's Name" />
				<input ref={c => this.farmlandNumber = c} type="string" placeholder="Farmland number" />
				<br />
				<button onClick={this.purchaseInsurance}>Purchase Insurance Policy</button>
				<button onClick={this.viewPurchasedPolicy}>View Purchased Policy</button>
                <br />
                <textarea ref={c => this.policyTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.policyInfo}></textarea>
				<br /><br />

				<h2>Process Farming Practice</h2>
				<br />
				<input ref={c => this.inputType = c} type="string" placeholder="Input type" />
				<input ref={c => this.inputAmount = c} type="string" placeholder="Input amount" />
				<br />
				<button onClick={this.updatePractice}>Update Practice</button>
                <br />
				<button onClick={this.retrievePractice}>Retrieve Full Practice</button>
                <br />
                <textarea ref={c => this.practiceTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.practiceInfo}></textarea>
				<br /><br />

				<h2>Request Weather Data</h2>
				<input ref={c => this.year = c} type="string" placeholder="Year" />
                <input ref={c => this.month = c} type="string" placeholder="Month" />
                <input ref={c => this.day = c} type="string" placeholder="Day" />
                <input ref={c => this.hour = c} type="string" placeholder="Hour (24-hour clock)" />
                <br />
				<input ref={c => this.longitude = c} type="string" placeholder="Longitude" />
                <input ref={c => this.latitude = c} type="string" placeholder="Latitude" />
				<br />
				<button onClick={this.retrieveWeatherData}>Retrieve Weather Data</button>
                <br />
                <textarea ref={c => this.weatherTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.weatherInfo}></textarea>
			</div>

		);
	}
}

