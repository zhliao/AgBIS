import React, { Component } from 'react'

export default class PublishPolicy extends Component {
    


    constructor(props) {
        super(props)
		this.state = {
			contract: null,
			web3: this.props.web3,
			account: this.props.account,
            ipfs: ''
		}
    }

    async componentWillMount() {
		this.setState({contract:this.props.contract})
	}

    publishPolicy = async () => {
        const {policyName} = this
        const {description} = this
        const {maxLevel} = this

        const {minLevel} = this
        const {salesClosingDate} = this
        const {finalPlantingDate} = this

        const {acreageReportingDate} = this
        const {productionReportingDate} = this
        const {premium} = this

        const salesClosingDateInt = Math.floor(new Date(salesClosingDate.value).getTime()/1000)
        const finalPlantingDateInt = Math.floor(new Date(finalPlantingDate.value).getTime()/1000)
        const acreageReportingDateInt = Math.floor(new Date(acreageReportingDate.value).getTime()/1000)
        const productionReportingDateInt = Math.floor(new Date(productionReportingDate.value).getTime()/1000)
        
        try {
            await this.props.contract.methods.publishNewPolicy(policyName.value, description.value, maxLevel.value, 
                minLevel.value, salesClosingDateInt, finalPlantingDateInt, 
                acreageReportingDateInt, productionReportingDateInt, premium.value)
           .send({ from: this.props.account })
        } catch (error) {
            console.log(error);
        }
        
    } 

    


    render() {
        return (
            <div>
                <h2>Publish New Policy</h2> 
                <input ref={c => this.policyName = c} type="string" placeholder="Policy Name" />
			    <input ref={c => this.description = c} type="string" placeholder="Description" />               
                <input ref={c => this.maxLevel = c} type="string" placeholder="Maximum Coverage Level" />
                <br />
                <input ref={c => this.minLevel = c} type="string" placeholder="Minimum Coverage Level" />
                <input ref={c => this.salesClosingDate = c} type="string" placeholder="Sales Closing Date (Y/M/D)" />
                <input ref={c => this.finalPlantingDate = c} type="string" placeholder="Final Planting Date (Y/M/D)" />
                <br />
                <input ref={c => this.acreageReportingDate = c} type="string" placeholder="Acreage Reporting Date (Y/M/D)" />
                <input ref={c => this.productionReportingDate = c} type="string" placeholder="Production Reporting Date (Y/M/D)" />
                <input ref={c => this.premium = c} type="string" placeholder="Premium (wei)" />
                <br />
                <button onClick={this.publishPolicy}>Add New Policies</button>
            </div>
        )
    }
}
