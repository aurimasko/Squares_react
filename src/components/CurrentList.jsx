					import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';

class CurrentList extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			coordX: null,
			coordY: null, 
			currentList: []
		};
		
		this.handleCoordXChange = this.handleCoordXChange.bind(this);
		this.handleCoordYChange = this.handleCoordYChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	render() {
		return(
			<div>	
						Current list of points: <br/>
						{this.state.currentList.length > 0 ? (
							<button type="submit" onClick={this.handleAllPointsDelete.bind(this)}>Delete all points</button>
						) : null}
						
						<table>
							<thead>
								<tr>
									<th>Coord X</th>
									<th>Coord Y</th>
									<th>Actions</th>
								</tr>
							</thead>
							
							<tbody>
								{this.state.currentList.map((point) => (
									<tr>
										<td>{point.pointX}</td>
										<td>{point.pointY}</td>
										<td>
											<button type="submit" onClick={this.handlePointDeleteSubmit.bind(this, point)}>Delete point</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<br/>
						Add new point to the current list:
				
						<form onSubmit={this.handleSubmit}>
							<label>Coordinate X:</label>
							<input value={this.state.coordX} type="number" onChange={this.handleCoordXChange}/>
							<br/>
							<label>Coordinate Y:</label>
							<input value={this.state.coordY} type="number" onChange={this.handleCoordYChange}/>
							<br/>
							<input type="submit" value="Add point"/>
						</form>
					</div>
					
					
		);
	}
	
	handleCoordXChange(event) {
		this.setState({ coordX: event.target.value });
	}
	handleCoordYChange(event) {
		this.setState({ coordY: event.target.value });
	}
	
	handleAllPointsDelete() {
		if(window.confirm('Are you sure you want to delete all points from the current list?'))
			this.setState({currentList: []});
	}
	
	handlePointDeleteSubmit(point) {
		const newList = this.state.currentList;
		
		if(newList.indexOf(point) > -1){
			newList.splice(newList.indexOf(point), 1);
			this.setState({currentList: newList});
		}
	}
	
	handleSubmit(event) {
		let alertMessage = '';
		
		if(this.state.coordX < -5000 || this.state.coordX > 5000 || this.state.coordX == null) {
			alertMessage = alertMessage + 'Coordinate X must be between -5000 and 5000.\n';
		}
		if(this.state.coordY < -5000 || this.state.coordY > 5000 || this.state.coordY == null) {
			alertMessage = alertMessage +  'Coordinate Y must be between -5000 and 5000.\n';
		}
		
		if(this.state.currentList.some(item => this.state.coordX == item.pointX && this.state.coordY == item.pointY)) {
			alertMessage = alertMessage + 'Duplicate points are not allowed\n';
		}
		
		if(this.state.currentList.length >= 10000)
			alertMessage = alertMessage + 'Maximum length of the list is 10 000. No more points can be added.\n';
		
		if(alertMessage != '')
			alert(alertMessage);
		else {
		this.setState({currentList:[...this.state.currentList, {pointX: this.state.coordX, pointY: this.state.coordY}]});
		}
		
		event.preventDefault();
	}
}
export default CurrentList;

