import React, { Component } from 'react';
import Modal from 'react-modal';
import './ClinicItem.css';

import Close from './images/close.svg';

// Custom styling used for patient info modal
const modalStyle = {
  content : {
    height: '400px',
    width: '500px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

class ClinicItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalContent: {}, // Re-populated every time a patient is pressed
    };
    // Binds necessary functions to 'this'
    this._popQueue = this._popQueue.bind(this);
    this._showModal = this._showModal.bind(this);
    this._hideModal = this._hideModal.bind(this);
    this._handleEsc = this._handleEsc.bind(this);
  }

  // Binds the ESC key for convenience of exiting modal
  componentWillMount() {
    document.addEventListener("keydown", this._handleEsc, false);
  }

  // The following two functions define modal open/close behaviour
  _showModal(index) {
    this.setState({showModal: true, modalContent: this.props.patients[index]});
  }

  _hideModal() {
    this.setState({showModal: false});
  }

  // Wrapper for hideModal in case you want to press ESC instead of the X on screen
  _handleEsc(e){
    if(e.keyCode === 27) {
      this._hideModal();
    }
  }
  
  // Renders each patient as a clickable button to open a modal with their info
  _renderPatients() {
    return this.props.patients.map((item, index) => {
      return (
        <button key={index} className="patient-btn" onClick={this._showModal.bind(this, index)}>
          <p key={index}>{item.name}: {item.care_card}</p>
        </button>
      )
    });
  }

  // Per clinic, gives the option to discharge the top patient in the list
  _popQueue() {
    fetch('http://kevinpi.ddns.net/clinics/' + this.props.clinic_id + '/patients', {
      method: 'DELETE',
    })
    .then((response) => {
      if (response.error) {
        console.warn('Error!', response.error);
      } else {
        this.props.onRefresh();
      }
    })
    .catch((error) => {
      console.warn('Error: ', error);
    });
  }

  render() {
    return (
      <div className="clinic-item">
        <Modal
          ariaHideApp={false}
          isOpen={this.state.showModal}
          contentLabel="Modal"
          style={modalStyle}
        >
          <div className="modal-content">
            <button className="close-modal" onClick={this._hideModal}>
              <img src={Close} alt="X">
              </img>
            </button>
            <p className="modal-title">
              Patient Information
            </p>
            <p className="patient-info">
              Full Name: {this.state.modalContent.name}
            </p>
            <p className="patient-info">
              Care Card Number: {this.state.modalContent.care_card}
            </p>
            <p className="patient-info">
              Phone Number: {this.state.modalContent.phone}
            </p>
            {/* <p className="patient-info">
              Heart Rate: {this.state.modalContent.heart_rate} BPM
            </p> */}
          </div>
        </Modal>
        <div className="header">
          <p className="clinic-name">
            {this.props.name}
          </p>
          <p className="clinic-address">
            {this.props.address}
          </p>
          <p className="waittime">
            Wait Time: {this.props.wait_time} hours
          </p>
          <button className="pop-btn" onClick={this._popQueue}>
            Pop Queue
          </button>
        </div>
        <div className="patient-list">
          {this._renderPatients()}
        </div>
      </div>
    );
  }
}

export default ClinicItem;
