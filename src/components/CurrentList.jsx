					import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import { listsService } from "../services/listsService.js";

function loadSelectedList(list) {
	this.setState({list});
}
	
class CurrentList extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			inputCoordX: null,
			inputCoordY: null, 
			currentList: [],
			isSaveListButtonClicked: false,
			listName: null
		};
		
		this.handleCoordXChange = this.handleCoordXChange.bind(this);
		this.handleCoordYChange = this.handleCoordYChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleListNameChange = this.handleListNameChange.bind(this);
		this.handleSaveListSubmit = this.handleSaveListSubmit.bind(this);
		loadSelectedList = loadSelectedList.bind(this);
	}

	async componentDidMount() {
		this.getData();
	}
	
	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id != this.props.match.params.id) {
			this.getData();
		}
	}
	
	async getData() {
		let id = this.props.match.params.id;
	
		if(id != null)
		{
			let result = await listsService.fetchById(id);
			
			if (result.isSuccess === true) {
				if(result.content != null)
					this.setState({currentList: result.content.points, listName: result.content.name});
			} else {
				this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.message})
			}
		}
		else
			this.setState({currentList: [], listName: null});
	}
	
	renderListActions(){
		if(this.state.listName != null) {
			return(
				<>
					<form onSubmit={this.handleUpdateListSubmit}>
						<label>List name:</label>
						<input type="text" value={this.state.listName} onChange={this.handleListNameChange}/>
						<br/>
						<input type="submit" value="Save changes"/>
					</form>
					
				</>
				);
		}
		else
		{
			if(this.state.currentList.length > 0) {
				return(
					<>
						<button type="submit" onClick={this.handleSaveTheList.bind(this)}>Save the list</button><br/><br/>
						<br/>
					</>
				);
			}
		}
	}
						
	renderSaveList() {
		if(this.state.isSaveListButtonClicked) {
			return(
				<>
					<form onSubmit={this.handleSaveListSubmit}>
						<label>List name:</label>
						<input type="text" value={this.state.listName} onChange={this.handleListNameChange}/>
						<br/>
						<input type="submit" value="Save the list"/>
					</form>
					<br/>	
				</>
			);
		}
		else 
			return null;
	}
	
	render() {
		return(
			<Layout>	
						<br/>
						<h2>Current list of points</h2>
						
						{this.renderListActions()}
						{this.renderSaveList()}
																				
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
										<td>{point.coordX}</td>
										<td>{point.coordY}</td>
										<td>
											<button type="submit" onClick={this.handlePointDeleteSubmit.bind(this, point)}>Delete point</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						
						{this.state.currentList.length > 0 ? (
							<button type="submit" onClick={this.handleAllPointsDelete.bind(this)}>Delete all points</button>
						) : null}
						<br/><br/>
						Add new point to the current list:
				
						<form onSubmit={this.handleSubmit}>
							<label>Coordinate X:</label>
							<input value={this.state.inputCoordX} type="number" onChange={this.handleCoordXChange}/>
							<br/>
							<label>Coordinate Y:</label>
							<input value={this.state.inputCoordY} type="number" onChange={this.handleCoordYChange}/>
							<br/>
							<input type="submit" value="Add point"/>
						</form>
					</Layout>
					
					
		);
	}
	
	handleListNameChange(event) {
		this.setState({ listName: event.target.value});
	}
	
	handleUpdateListSubmit(event){
			/*listsService.updateList(this.state.listId, this.state.currentList).then((data) => {
			if(data.isSuccess) {
				alert('List was successfuly updated');
			}
			else
				alert('Error' + data.message);
		});*/
	}
		
	handleSaveListSubmit(event) {
		listsService.createList(this.state.listName, this.state.currentList).then((data) => {
			if(data.isSuccess) {
				alert('List was successfuly saved');
				
				this.setState({isSaveListButtonClicked: false});
			}
			else
			{
				alert('Error: ' + data.message);
			}
		});
		event.preventDefault();
	}
	
	handleSaveTheList(event) {
		this.setState({isSaveListButtonClicked: true});
	}
	
	handleCoordXChange(event) {
		this.setState({ inputCoordX: event.target.value });
	}
	handleCoordYChange(event) {
		this.setState({ inputCoordY: event.target.value });
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
		
		if(this.state.inputCoordX < -5000 || this.state.inputCoordX > 5000 || this.state.inputCoordX == null) {
			alertMessage = alertMessage + 'Coordinate X must be between -5000 and 5000.\n';
		}
		if(this.state.inputCoordY < -5000 || this.state.inputCoordY > 5000 || this.state.inputCoordY == null) {
			alertMessage = alertMessage +  'Coordinate Y must be between -5000 and 5000.\n';
		}
		
		if(this.state.currentList.some(item => this.state.inputCoordX == item.coordX && this.state.inputCoordY == item.coordY)) {
			alertMessage = alertMessage + 'Duplicate points are not allowed\n';
		}
		
		if(this.state.currentList.length >= 10000)
			alertMessage = alertMessage + 'Maximum length of the list is 10 000. No more points can be added.\n';
		
		if(alertMessage != '')
			alert(alertMessage);
		else {
		this.setState({currentList:[...this.state.currentList, {coordX: this.state.inputCoordX, coordY: this.state.inputCoordY}]});
		}
		
		event.preventDefault();
	}
}
export default CurrentList;

