import React from 'react';

import { Link } from "react-router-dom";
import Layout from './Layout';
import Squares from './Squares';
import CurrentList from './CurrentList';
import { listsService } from "../services/listsService.js";

class List extends React.Component {

	constructor(props) {
		super(props);
		
		this.state = { 
			list: { id: null, Name: null, points: [] },
			isGettingListData: false
		}
		
		this.squaresRef = React.createRef();
		
		this.updateListPoints = this.updateListPoints.bind(this);
		this.updateList = this.updateList.bind(this);
	}
	

	async componentDidMount() {
		this.getData();
	}
	
	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id != this.props.match.params.id) {
			this.updateList(null);
			this.getData();
		}
	}
	
	async getData() {
		let id = this.props.match.params.id;

		if(id != null)
		{
			this.setState({isGettingListData: true});
			
			const result = await listsService.fetchById(id);
			
			if (result.isSuccess === true) {
				if(result.content != null)
					this.setState({list:result.content, isGettingListData: false});
			} else {
				this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.message})
			}
		}
	}
		
	updateListPoints(listPoints) {
		const oldList = this.state.list;
		let newList = this.state.list;
		newList.points = listPoints;

		this.setState({list: newList});
		this.squaresRef.current.calculateSquares(this.state.list.points);
	};
		
	updateList(list)
	{
		if(list == null)
		{
			this.setState({list: { id: null, Name: null, points: []}});
			this.squaresRef.current.calculateSquares([]);		
		}
		else
		{
			this.setState({list: list});
			this.squaresRef.current.calculateSquares(this.state.list.points);		
		}
	};
	
	render() {
		return(
			<Layout>
				<div class='container'>
					<CurrentList isGettingListData={this.state.isGettingListData} list={this.state.list} updateListPoints={this.updateListPoints} updateList={this.updateList}/>
					<Squares ref={this.squaresRef} listId={this.props.match.params.id} listPoints={this.state.list.points} updateListPoints={this.updateListPoints}/>
				</div>
			</Layout>
		);
	}
}

export default List;