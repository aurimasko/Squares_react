import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import { listsService } from "../services/listsService.js";

class Lists extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			lists: [],
			errmessage: ''
		};
	}
	
	async componentDidMount() {
		
		let result = await listsService.fetch();
		
		if (result.isSuccess === true) {
			this.setState({
				lists: result.content
			});
		} else {
			this.setState({errmessage: 'It is not possible to get lists. Error message: ' + result.errmessage})
		}
	}
		
	render() {
		return(
			<Layout>
				{this.state.errmessage}
							All saved lists (select which one you want to load):<br/>
							
							{this.state.lists.map((list, position) => (
								<div>{position + 1}. {list.name}</div>
							))}
			</Layout>
		);
	}
}

export default Lists;