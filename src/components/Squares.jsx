import React from 'react';
import { squaresService } from "../services/squaresService.js";
import ReactLoading from "react-loading";
import constants from "../constants.js";
import '../style.css';
import TablePagination from "@material-ui/core/TablePagination";

class Squares extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isCalcSquaresButtonClicked: false,
			squaresList: { squaresCount: 0, squares: [] },
			currentPage: 0,
			rowsPerPage: 10
		};
		
		this.changeCurrentPage = this.changeCurrentPage.bind(this);
		this.changeRowsPerPage = this.changeRowsPerPage.bind(this);
	}
		
	async componentDidUpdate(prevProps) {
		if (prevProps.listId != this.props.listId) {
			this.setState({squaresList: { squaresCount: 0, squares:[] }});
		}
	}
	
	changeCurrentPage(event, newPage) {
		this.setState({currentPage: newPage});
	}
	
	changeRowsPerPage(event) {
		this.setState({currentPage: 0, rowsPerPage: parseInt(event.target.value, 10)});
	}
	
	renderCalculateSquaresButton() {
				
		if(!this.state.isCalcSquaresButtonClicked)
		{
			if(this.props.listPoints.length > 0)
			{
				return(
					<button type="submit" onClick={this.calculateSquares.bind(this, this.props.listPoints)}>Calculate squares</button>
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
	
	renderSquaresList() {
		if(this.state.squaresList.squaresCount > 0)
		{
			return(
					<div>							
						<p>Total square counts in this list of points: {this.state.squaresList.squaresCount}</p>
							
						<table>								
							<tbody>
								{this.state.squaresList.squaresCount > 0 && 
								this.state.squaresList.squares.map((square) => (
									<tr>
										{square.points.map((point) => (
											<td>({point.coordX};{point.coordY})</td>
										))}
									</tr>
								))
								}
							</tbody>
						</table>
						
						<TablePagination  
								count={this.state.squaresList.squaresCount}
								page={this.state.currentPage}
								rowsPerPage={this.state.rowsPerPage}
								onPageChange={this.changeCurrentPage}
								onRowsPerPageChange={this.changeRowsPerPage}
								rowsPerPageOptions={[5, 10, 20, 50]}
						/>
					</div>
				);
		}
		else
		{
			if(!this.state.isCalcSquaresButtonClicked)
				return(<p>No squares are found!</p>);
			else
				return null;
		}
	}
		
	render() {
		return(
			<div class='block'>
				<h2>Squares</h2>
				{this.renderCalculateSquaresButton()}
				{this.renderSquaresList()}
			</div>	
		);
	}
	
	calculateSquares(points) {
		this.setState({isCalcSquaresButtonClicked: true, squaresList: { squaresCount: 0, squares: [] }});
		
		squaresService.calculateSquares(points).then((data) => {
			if(data.isSuccess) {
				this.setState({squaresList:data.content});
			}
			else
			{
				alert('Error: ' + data.message);
			}
			this.setState({isCalcSquaresButtonClicked: false});	
		});	
	}
}
export default Squares;

