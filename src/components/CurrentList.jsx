import React from 'react';
import ReactLoading from "react-loading";
import AddPoint from './AddPoint';
import ImportFile from './ImportFile';
import constants from "../constants.js";
import '../style.css';
import { listsService } from "../services/listsService.js";
import TablePagination from "@material-ui/core/TablePagination";

export  function printArray(arr) {
let str = "";

  for (let item of arr) {
    if (Array.isArray(item)) str += printArray(item);
    else str += item + ", ";
  }
  return str;
}


class CurrentList extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { 
			inputListName: null,
			isSaveListButtonClicked: false,
			sortDirection: 'ascending',
			sortedByField: '',
			currentPage: 0,
			rowsPerPage: 10
		};
		
		this.handleListNameChange = this.handleListNameChange.bind(this);
		this.handleSaveListSubmit = this.handleSaveListSubmit.bind(this);
		this.changeCurrentPage = this.changeCurrentPage.bind(this);
		this.changeRowsPerPage = this.changeRowsPerPage.bind(this);
	}
			
	changeCurrentPage(event, newPage) {
		this.setState({currentPage: newPage});
	}
	
	changeRowsPerPage(event) {
		this.setState({currentPage: 0, rowsPerPage: parseInt(event.target.value, 10)});
	}
	
	sortPoints(field) {
		const sortableItems = [...this.props.list.points];
		const sortFunction = this.state.sortDirection == 'ascending' ? (a, b) => b[field] - a[field] : (a, b) => a[field] - b[field];
		sortableItems.sort(sortFunction);

		this.props.updateListPoints(sortableItems);
		this.setState({sortDirection: this.state.sortDirection == 'ascending' ? 'descending' : 'ascending', sortedByField: field});
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
	
	getSortClass(field) { 
		if(this.state.sortedByField == field)
		{
			if(this.state.sortDirection == 'ascending')
				return "sortAsc";
			else
				return "sortDesc";
		}
		else
			return "sort";
	}
	
	render() {
		return(
					<div class='block'>
						<h2>Current list of points</h2>
						
						{this.renderListSaveButton()}
						{this.props.list.points.length > 0 ? (
							<div>
								<button type="submit" onClick={this.handleAllPointsDelete.bind(this)}>Delete all points</button><br/>
								<button onClick={this.exportList.bind(this)}>Export points to file</button>
								<br/><br/>
							</div>
						) : null}
						
						{this.props.isGettingListData == false ? 
							<div>
								<table>
									<thead>
									{this.props.list.points.length > 0 ?
										<tr>
											<th><button class={this.getSortClass('coordX')} type="submit" onClick={this.sortPoints.bind(this,'coordX')}>Coord X</button></th>
											<th><button class={this.getSortClass('coordY')} type="submit" onClick={this.sortPoints.bind(this, 'coordY')}>Coord Y</button></th>
											<th>Actions</th>
										</tr> : 
										<tr><th>List has no points</th></tr>
									}
									</thead>
									<tbody>
										{this.props.list.points.slice((this.state.rowsPerPage * (this.state.currentPage)), (this.state.rowsPerPage * (this.state.currentPage) + this.state.rowsPerPage)).map((point) => (
											<tr>
												<td>{point.coordX}</td>
												<td>{point.coordY}</td>
												<td>
													<button type="submit" onClick={this.handlePointDeleteSubmit.bind(this, point)}>Delete point</button>
												</td>
											</tr>
										))}
									</tbody>
									
									{this.props.list.points.length > 0 &&
									<TablePagination  
										count={this.props.list.points.length}
										page={this.state.currentPage}
										rowsPerPage={this.state.rowsPerPage}
										onPageChange={this.changeCurrentPage}
										onRowsPerPageChange={this.changeRowsPerPage}
										rowsPerPageOptions={[5, 10, 20, 50]}
									/>
									}
								</table>
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

	
	exportList() {
		let fileData = "";
		this.props.list.points.forEach(point => fileData = fileData + (fileData.length > 0 ? '\n':'') + point.coordX + ' ' + point.coordY);
		
		const element = document.createElement("a");
		const file = new Blob([fileData], {type: 'text/plain'});
		element.href = URL.createObjectURL(file);
		element.download = constants.EXPORT_FILE_NAME;
		document.body.appendChild(element);
		element.click();
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

