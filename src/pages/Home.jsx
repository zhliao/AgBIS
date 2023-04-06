import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Home extends Component {
    render() {
   
        return (
            <div>
                <h2 className="text-center">Home Page</h2>
                <br />
                <ul >
                    {/* navigation, like <Link>, <NavLink>, and <Redirect> */}
                    <li ><Link to="/fcic">Regulatory Authority</Link></li>
                    <li ><Link to="/provider">Insurance Provider</Link></li>
                    <li ><Link to="/customer">Customer</Link></li>
                    <li ><Link to="/adjuster">Adjuster</Link></li>
                    <li ><Link to="/agent">Agent</Link></li>
                </ul>
            </div>
        )
    }
}
