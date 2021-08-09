import React from 'react';
import constants from "../constants.js";

class AddPoint extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			inputCoordX: null,
			inputCoordY: null
		}
		
		this.handleCoordXChange = this.handleCoordXChange.bind(this);
		this.handleCoordYChange = this.handleCoordYChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		return(
			<div>
				<h2>Add new point to the current list</h2>
					
				<form onSubmit={this.handleSubmit}>
					<label>Coordinate X: </label>
					<input value={this.state.inputCoordX} type="number" onChange={this.handleCoordXChange}/>
					<br/>
					<label>Coordinate Y: </label>
					<input value={this.state.inputCoordY} type="number" onChange={this.handleCoordYChange}/>
					<br/><br/>
					<input type="submit" value="Add point"/>
				</form>
			</div>
		);
	}
	
	handleCoordXChange(event) {
		this.setState({ inputCoordX: event.target.value });
	}
	handleCoordYChange(event) {
		this.setState({ inputCoordY: event.target.value });
	}
	
	handleSubmit(event) {
		let alertMessage = '';
		
		if(this.state.inputCoordX < constants.MIN_X_COORD || this.state.inputCoordX > constants.MAX_X_COORD || this.state.inputCoordX == null) {
			alertMessage = alertMessage + 'Coordinate X must be between ' + constants.MIN_X_COORD + ' and ' + constants.MAX_X_COORD + '.\n';
		}
		if(this.state.inputCoordY < constants.MIN_Y_COORD || this.state.inputCoordY > constants.MAX_X_COORD || this.state.inputCoordY == null) {
			alertMessage = alertMessage +  'Coordinate Y must be between ' + constants.MIN_Y_COORD + ' and ' + constants.MAX_Y_COORD +'.\n';
		}
		
		if(this.props.listPoints.some(item => this.state.inputCoordX == item.coordX && this.state.inputCoordY == item.coordY)) {
			alertMessage = alertMessage + 'Duplicate points are not allowed\n';
		}
		
		if(this.props.listPoints.length >= constants.MAX_LIST_LENGTH)
			alertMessage = alertMessage + 'Maximum length of the list is ' + constants.MAX_LIST_LENGTH + '. No more points can be added.\n';

		if(alertMessage != '')
			alert(alertMessage);
		else {
			this.props.updateListPoints([...this.props.listPoints, {coordX: this.state.inputCoordX, coordY: this.state.inputCoordY}]);
		}
		event.preventDefault();
	}	
}

export default AddPoint;