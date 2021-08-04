					import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import { listsService } from "../services/listsService.js";
import { fileService } from "../services/fileService.js";
/*
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);
  
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }

  return { items: sortedItems, requestSort };
}*/

class CurrentList extends React.Component {


	constructor(props) {
		super(props);
		
		this.state = {
			inputCoordX: null,
			inputCoordY: null, 
			inputListName: null,
			list: { id: null, Name: null },
			listPoints: [],
			isSaveListButtonClicked: false,
			sortDirection: 'ascending'
		};
		
		this.handleCoordXChange = this.handleCoordXChange.bind(this);
		this.handleCoordYChange = this.handleCoordYChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleListNameChange = this.handleListNameChange.bind(this);
		this.handleSaveListSubmit = this.handleSaveListSubmit.bind(this);
	}
			
	showFile = async (e) => {
		e.preventDefault()

		let result = await fileService.importFile(e.target.files[0]);
		
		e.target.value = null;

		if (result.isSuccess === true) {
			if(result.content != null)
				// to do: avoid duplicates
				// max 10 000
				this.setState({listPoints: result.content.points});
			
				if(result.content.skippedLines)
					alert('Some lines in the file was skipped because it was presented in the wrong format or duplicated.');
		} else {
			this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.message})
		}
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
					this.setState({listPoints: result.content.points, list: result.content});
			} else {
				this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.message})
			}
		}
		else
			this.setState({listPoints: [], list: { Name: null, id:null}});
	}
	
	renderListActions(){
		if(this.state.list.name != null) {
			return(
				<>
					<form onSubmit={this.handleSaveListSubmit}>
						<label>List name: {this.state.list.name}</label>
						<br/>
						<input type="submit" value="Save changes"/>
					</form>
					
				</>
				);
		}
		else
		{
			if(this.state.listPoints.length > 0) {
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
						<input type="text" value={this.state.inputListName}  onChange={this.handleListNameChange}/>
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

	renderAddNewPoints() {
		if(this.state.listPoints.length >= 10000){
			return(<p>List if full (max 10 000 points). In order to add new points, you need to delete some of the existing ones.</p>);
		}
		else
		{
			return (
					<>
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
						<br/><br/>
						Import file of points:<br/>
						<input type="file" accept=".txt" onChange={(e) => this.showFile(e)}/><br/>
					</>
				);
		}
	}
	sortPoints(field) {
		let sortableItems = [...this.state.listPoints];
		let sortFunction = this.state.sortDirection == 'ascending' ? (a, b) => b[field] - a[field] : (a, b) => a[field] - b[field];
		sortableItems.sort(sortFunction);
		
		this.setState({listPoints: sortableItems, sortDirection: this.state.sortDirection == 'ascending' ? 'descending' : 'ascending'});
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
									<th><button type="submit" onClick={this.sortPoints.bind(this,'coordX')}>Coord X</button></th>
									<th><button type="submit" onClick={this.sortPoints.bind(this, 'coordY')}>Coord Y</button></th>
									<th>Actions</th>
								</tr>
							</thead>
							
							<tbody>
								{this.state.listPoints.map((point) => (
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
						
						{this.state.listPoints.length > 0 ? (
							<button type="submit" onClick={this.handleAllPointsDelete.bind(this)}>Delete all points</button>
						) : null}
						<br/><br/>
						{this.renderAddNewPoints()}
					</Layout>
					
					
		);
	}
	
	handleListNameChange(event) {
		this.setState({inputListName: event.target.value});
	}
	
	handleUpdateListSubmit(event){
			listsService.updateList(this.state.list.id, this.state.listPoints).then((data) => {
			if(data.isSuccess) {
				alert('List was successfuly updated');
			}
			else
				alert('Error' + data.message);
		});
	}
		
	handleSaveListSubmit(event) {//-------------------------------------------------
		listsService.createList(/*this.state.inputListName*/this.state.list.name, this.state.listPoints).then((data) => {
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
			this.setState({listPoints: []});
	}
	
	handlePointDeleteSubmit(point) {
		const newList = this.state.listPoints;
		
		if(newList.indexOf(point) > -1){
			newList.splice(newList.indexOf(point), 1);
			this.setState({listPoints: newList});
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
		
		if(this.state.listPoints.some(item => this.state.inputCoordX == item.coordX && this.state.inputCoordY == item.coordY)) {
			alertMessage = alertMessage + 'Duplicate points are not allowed\n';
		}
		
		if(this.state.listPoints.length >= 10000)
			alertMessage = alertMessage + 'Maximum length of the list is 10 000. No more points can be added.\n';
		
		if(alertMessage != '')
			alert(alertMessage);
		else {
		this.setState({listPoints:[...this.state.listPoints, {coordX: this.state.inputCoordX, coordY: this.state.inputCoordY}]});
		}
		
		event.preventDefault();
	}
}
export default CurrentList;

