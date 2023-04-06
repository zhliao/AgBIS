import React, { Component } from 'react'
const apiKey = '6aa7887c25a4359416324cf577d324ec';


export default class RequestWeatherData extends Component {
    constructor(props) {
		super(props)
		this.state = {
            weatherInfo:""
		}
	}

    retrieveWeatherData = async () => {
        //The month in Date() is 0-indexed
        let today = new Date(this.year.value, this.month.value - 1, this.day.value);
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
                <h2>Request Weather Data</h2>
				<input ref={c => this.year = c} type="string" placeholder="Year" />
                <input ref={c => this.month = c} type="string" placeholder="Month" />
                <input ref={c => this.day = c} type="string" placeholder="Day" />
                <input ref={c => this.hour = c} type="string" placeholder="Hour (24-hour clock)" />
                <br />
				<input ref={c => this.longitude = c} type="string" placeholder="Longitude" />
                <input ref={c => this.latitude = c} type="string" placeholder="Latitude" />
                <button onClick={this.retrieveWeatherData}>Retrieve Weather Data</button>
                <br />
                <textarea ref={c => this.weatherTextArea = c} readOnly rows = '8' cols = '50' value = {this.state.weatherInfo}></textarea>
            </div>
        )
    }
}
