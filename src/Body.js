import React, { Component } from 'react';
import './Body.css';

import ClinicItem from './ClinicItem.js';
import LoadingSpinner from './LoadingSpinner.js';
import Reload from './images/reload.svg';

class Body extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicList: [], // This will be populated upon load
      isLoading: false, // Indicates when we are waiting for an HTTP request
    };
    this._refreshPage = this._refreshPage.bind(this);
  }

  // Re-fetches clinic data from server, upon refresh
  _refreshPage() {
    this._retrieveClinicData();
  }

  // API call to server to retrieve all clinic data
  _retrieveClinicData() {
    this.setState({isLoading: true});
    fetch('http://kevinpi.ddns.net/clinics', {
      method: 'GET',
    }).then((res) => res.json())
    .then((response) => {
      if (response.error) {
        console.warn('Error!', response.error);
      } else {
        console.log(response);
        this.setState({
          clinicList: response.sort((a, b) => (a.clinic_id - b.clinic_id)),
          isLoading: false
        });
      }
      // Gonna wanna set isLoading false HERE instead, with error message if needed
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  // Pre-loading work done here; namely, initial data fetching
  componentWillMount() {
    this._retrieveClinicData();
  }
  
  // Renders all clinics in database in clean UI; when loading, shows spinner
  _renderClinics() {
    return this.state.isLoading ?
    (
    <div className="spinner-wrapper">
      <LoadingSpinner />
    </div>
    )
    :
    this.state.clinicList.map((item, index) => {
      return (
        <ClinicItem key={index} {...item} onRefresh={this._refreshPage} />
      )
    });
  }

  render() {
    return (
      <div className="body">
        <button className="reload-btn" onClick={this._refreshPage}>
          <img className="reload" src={Reload} alt="Reload" />
        </button>
        {this._renderClinics()}
      </div>
    );
  }
}

export default Body;
