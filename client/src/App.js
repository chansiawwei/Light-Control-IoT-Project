import React, { Component } from 'react';
import axios from 'axios'
import qs from 'qs'

import LM35 from './lm35.jpg'
import Motor from './motor.jpg'
import Outdoor from './tempOutdoor.png'
import './App.css';

class App extends Component {

  state = {
    textfieldTemp: '',
    motorSwitch: true,
    outdoorTemperature: null,
    roomTemperature: null,
  }

  componentDidMount(){
    if(!!navigator.geolocation){
      // geolocation supported!!

      navigator.geolocation.getCurrentPosition(position => this.getOutdoorTemp(position, this.handleRetriveTemp))

    } else{
      // geolocation not supported

      // May be ask for name of city
    }

    ((setRoomTemp) =>{
      axios.get('/sensorTemp')
      .then(function (response) {
        setRoomTemp(response.data.roomTemperature)
        // this.sense(response.data.roomTemperature, this.handleRetriveSensorTemp)
      })
      .catch(function (error) {
        console.log(error);
      })
    })((temp => this.setState({roomTemperature: temp})))

  }

  getOutdoorTemp = (position, changeState) => {
    const coordinate = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }

    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinate.lat}&lon=${coordinate.lon}&units=metric&appid=f9eb00dc56072cc30fec3527de635026`)
    .then(function (response) {
      console.log(response);
      changeState(response.data.main.temp);
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  handleRetriveTemp = (temp) => {
    this.setState({ ...this.state, outdoorTemperature: temp.toFixed(1)})
  }

  handleTempChange = (event) => {
    this.setState({ ...this.state, textfieldTemp: event.target.value})
  }

  handleTempSet = () => {
    // Temperature submitted
    const temperature = Number(this.state.textfieldTemp)
    console.log(temperature)

    axios.post('/roomTemp', qs.stringify({temp: temperature}))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleSwitch = (event) =>{
    const enabled = event.target.checked
    this.setState({ ...this.state, motorSwitch: enabled})

    axios.post('/motor', qs.stringify({enabled: enabled}))
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <header>
          <nav className="navbar navbar-light bg-dark">
            <a className="navbar-brand text-white mx-auto " href="#">
              Temparature IoT
            </a>
          </nav>
        </header>
        <section>
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-3 bg-light p-4">
                  <h3 className="mb-4">Room Temperature</h3>
                  <img src={LM35} alt="Temperature Sensor" className="img-fluid rounded"/>
                  {
                    (this.state.roomTemperature) ? (
                      <h4 className="mt-3">{this.state.roomTemperature}&#176;C</h4>
                    ) : (
                      <div class="spinner-border mt-3" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    )
                  }
                  <input className="form-control mt-3" type="text" name="roomTemp" placeholder="20&#176;C" onChange={this.handleTempChange}></input>
                  <button type="button" className="btn btn-primary mt-3" onClick={this.handleTempSet}>Set</button>
              </div>
              <div className="col-md-3 offset-md-1 bg-light p-4">
                <h3 className="mb-4">Electric Motor</h3>
                <img src={Motor} alt="Electric Motor" className="img-fluid rounded"/>
                <div id="motor-status" className="mt-3">
                  <h4 className="m-0 d-inline-block">Status:</h4>
                  <p className="m-0 d-inline-block ml-2">ON</p>
                </div>
                <div className="custom-control custom-switch mt-3">
                  <input type="checkbox" className="custom-control-input" id="customSwitch1" onChange={this.handleSwitch} defaultChecked={true}/>
                  <label className="custom-control-label" for="customSwitch1">Motor Enable</label>
                </div>
              </div>
              <div className="col-md-3 offset-md-1 bg-light p-4">
                <h3 className="mb-4">Temperature Outdoor</h3>
                <p className="lead">From where?</p>
                <img src={Outdoor} alt="Temperature Sensor" className="img-fluid rounded"/>
                {
                  (this.state.outdoorTemperature) ? (
                    <h4 className="mt-3">{this.state.outdoorTemperature}&#176;C</h4>
                  ) : (
                    <div class="spinner-border mt-3" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
