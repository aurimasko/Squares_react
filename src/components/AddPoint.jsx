import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';

class AddPoint extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			coordX: null,
			coordY: null
		}
		
		this.handleCoordXChange = this.handleCoordXChange.bind(this);
		this.handleCoordYChange = this.handleCoordYChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		return(
			<Layout>
				Add new point:
				
				<form onSubmit={this.handleSubmit}>
					<label>Coordinate X:</label>
					<input value={this.state.coordX} type="number" onChange={this.handleCoordXChange}/>
					
					<label>Coordinate Y:</label>
					<input value={this.state.coordY} type="number" onChange={this.handleCoordYChange}/>
					
					<input type="submit" value="Add point"/>
				</form>
			</Layout>
		);
	}
	
	handleCoordXChange(event) {
		this.setState({ coordX: event.target.value });
	}
	handleCoordYChange(event) {
		this.setState({ coordY: event.target.value });
	}
	
	handleSubmit(event) {
		
		event.preventDefault();
	}
	
}

export default AddPoint;