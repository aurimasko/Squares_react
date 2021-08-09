import React from 'react';
import ReactLoading from "react-loading";
import AddPoint from './AddPoint';
import ImportFile from './ImportFile';
import constants from "../constants.js";
import '../style.css';
import { listsService } from "../services/listsService.js";

class CurrentList extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { 
			inputListName: null,
			isSaveListButtonClicked: false,
			isGettingListData: false,
			sortDirection: 'ascending'
		};
		
		this.handleListNameChange = this.handleListNameChange.bind(this);
		this.handleSaveListSubmit = this.handleSaveListSubmit.bind(this);
	}
	
	async componentDidMount() {
		this.getData();
	}
	
	async componentDidUpdate(prevProps) {
		if (prevProps.listId != this.props.listId) {
			this.props.updateList(null);
			this.setState({isGettingListData: false, isSaveListButtonClicked: false, isGettingListData: false});
			this.getData();
		}
	}
	
	async getData() {
		let id = this.props.listId;
	
		if(id != null)
		{
			this.setState({isGettingListData: true});
			
			const result = await listsService.fetchById(id);
			
			if (result.isSuccess === true) {
				if(result.content != null)
					this.props.updateList(result.content);
					this.setState({isGettingListData: false});
			} else {
				this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.message})
			}
		}
	}
						
	sortPoints(field) {
		const sortableItems = [...this.props.list.points];
		const sortFunction = this.state.sortDirection == 'ascending' ? (a, b) => b[field] - a[field] : (a, b) => a[field] - b[field];
		sortableItems.sort(sortFunction);

		this.props.updateListPoints(sortableItems);
		this.setState({sortDirection: this.state.sortDirection == 'ascending' ? 'descending' : 'ascending'});
	}
		
	saveList(name, points) {
		this.setState({isSaveListButtonClicked: true});
			
			listsService.createList(name, points).then((data) => {
				if(data.isSuccess) {
					alert('List was successfuly saved');
				}
				else
				{
					alert('Error: ' + data.message);
				}
				this.setState({isSaveListButtonClicked: false});	
			});		
	}
	
	renderListSaveButton(){
		if(!this.state.isSaveListButtonClicked)
		{
			if(this.props.list.name != null) {
				return(
					<form onSubmit={this.saveList.bind(this, this.props.list.name, this.props.list.points)}>
						<label>List name: {this.props.list.name}</label>
						<br/>
						<input type="submit" value="Save changes"/>
						<br/>
					</form>
				);
			}
			else
			{
				if(this.props.list.points.length > 0) {
					return(
						<form onSubmit={this.handleSaveListSubmit}>
							<label>List name: </label>
							<input type="text" value={this.state.inputListName}  onChange={this.handleListNameChange}/>
							<br/>
							<input type="submit" value="Save the list"/>
							<br/>
						</form>	
					);
				}
			}
		}
		else
		{
			return(
				<ReactLoading type="balls" color="red" height={50} width={50}/>
			);
		}
	}
	
	renderCalculateSquaresButton() {
				
		if(!this.state.isCalcSquaresButtonClicked)
		{
			if(this.props.list.points.length > 0)
			{
				return(
					<button type="submit" onClick={this.calculateSquares.bind(this)}>Calculate squares</button>
				);
			}
		}
		else
		{
			return(
				<ReactLoading type="balls" color="red" height={50} width={50}/>
			);
		}
	
	}
						
	renderAddNewPoints() {
		if(this.props.list.points.length >= constants.MAX_LIST_LENGTHmaximumListLength){
			return(<p>List if full (max {constants.MAX_LIST_LENGTH} points). In order to add new points, you need to delete some of the existing ones.</p>);
		}
		else
		{
			return (
					<div>
						<AddPoint updateListPoints={this.props.updateListPoints} listPoints={this.props.list.points}/>
						<ImportFile listPoints={this.props.list.points} updateListPoints={this.props.updateListPoints}/>			
					</div>
				);
		}
	}
	
	render() {
		return(
					<div class='block'>
						<h2>Current list of points</h2>
						
						{this.renderListSaveButton()}
							
						{this.state.isGettingListData == false ? 
							<div>
								<table>
									<thead>
									{this.props.list.points.length > 0 ?
										<tr>
											<th><button type="submit" onClick={this.sortPoints.bind(this,'coordX')}>Coord X</button></th>
											<th><button type="submit" onClick={this.sortPoints.bind(this, 'coordY')}>Coord Y</button></th>
											<th>Actions</th>
										</tr> : 
										<tr><th>List has no points</th></tr>
									}
									</thead>
									<tbody>
										{this.props.list.points.map((point) => (
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
														
								{this.props.list.points.length > 0 ? (
									<button type="submit" onClick={this.handleAllPointsDelete.bind(this)}>Delete all points</button>
								) : null}
							</div>
						:
							<ReactLoading type="balls" color="red" height={50} width={50}/>
						}
						
						{this.renderAddNewPoints()}
					</div>
		);
	}

	handleListNameChange(event) {
		this.setState({inputListName: event.target.value});
	}
			
	handleSaveListSubmit(event) {
		
		if(this.state.inputListName == "" || this.state.inputListName == null)
			alert('Please insert list name!');
		else
		{
			const newList = this.props.list;
			newList.name = this.state.inputListName;
			this.setState({list: newList});

			this.saveList(this.props.list.name, this.props.list.points);
		}		
		event.preventDefault();
	}
	
	handleAllPointsDelete() {
		if(window.confirm('Are you sure you want to delete all points from the current list?'))
			this.props.updateListPoints([]);
	}
	
	handlePointDeleteSubmit(point) {
		const newList = this.props.list.points;
		
		if(newList.indexOf(point) > -1){
			newList.splice(newList.indexOf(point), 1);
			this.props.updateListPoints(newList);
		}
	}
}
export default CurrentList;

