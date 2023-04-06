import React, { Component } from 'react'

export default class ViewBalance extends Component {
    constructor(props) {
		super(props)
		this.state = {
			contract: this.props.contract,
			web3: this.props.web3,
			account: this.props.account,
            balance: ""
		}
	}

    viewBalance = async () => {
        const web3 = this.props.web3
        let balance
        await this.props.web3.eth.getBalance(this.props.account, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                balance = "Your balance is: " + web3.utils.fromWei(result, "ether") + " ETH"
                console.log(balance);
                
            }
        });
        this.setState({balance})
    }
    render() {
        return (
            <div>
                <h2>View Balance</h2>
                <button onClick={this.viewBalance}>View Balance</button>
                <br />
                <textarea ref={c => this.balanceTextArea = c} readOnly rows = '3' cols = '50' value = {this.state.balance} placeholder = {"Your balance is:" }></textarea>
            </div>
        )
    }
}
