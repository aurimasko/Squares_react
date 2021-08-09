import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import Squares from './Squares';
import CurrentList from './CurrentList';

class List extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { 
			list: { id: null, Name: null, points: [] },
			listPoints: []
		}
		
		this.squaresRef = React.createRef();
		
		this.updateListPoints = this.updateListPoints.bind(this);
		this.updateList = this.updateList.bind(this);
	}
	
	updateListPoints(listPoints) {
		let newList = this.state.list;
		newList.points = listPoints;
		
		this.setState({list: newList});
		this.squaresRef.current.calculateSquares(this.state.list.points);
	};
		
	updateList(list) {
		if(list == null)
			this.setState({list: { id: null, Name: null, points: []}});
		else
			this.setState({list: list});
		
		this.squaresRef.current.calculateSquares(this.state.list.points);		
	};
	
	render() {
		return(
			<Layout>
				<div class='container'>
					<CurrentList listId={this.props.match.params.id} list={this.state.list} updateListPoints={this.updateListPoints} updateList={this.updateList}/>
					<Squares ref={this.squaresRef} listPoints={this.state.list.points} updateListPoints={this.updateListPoints}/>
				</div>
			</Layout>
		);
	}
}

export default List;