import React from 'react';
import { squaresService } from "../services/squaresService.js";
import ReactLoading from "react-loading";
import constants from "../constants.js";
import '../style.css';

class Squares extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			isCalcSquaresButtonClicked: false,
			squaresList: { squaresCount: 0, squares: [] }
		};
	}
		
	renderCalculateSquaresButton() {
				
		if(!this.state.isCalcSquaresButtonClicked)
		{
			if(this.props.listPoints.length > 0)
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
		
	render() {
		return(
			<div class='block'>
				<h2>Squares</h2>
				{this.renderCalculateSquaresButton()}

				{this.state.squaresList.squaresCount > 0 ?
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
					</div>
					:
					<p>No squares are found!</p>
				}
			</div>	
		);
	}
	
	calculateSquares2(points) {
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
	calculateSquares(event) {
		this.setState({isCalcSquaresButtonClicked: true, squaresList: { squaresCount: 0, squares: [] }});
		
		squaresService.calculateSquares(this.props.listPoints).then((data) => {
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

