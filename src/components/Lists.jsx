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

	async handleDeleteListSubmit(list) {
		let result = await listsService.deleteList(list);
		
		if (result.isSuccess === true) {
			this.setState({
				lists: this.state.lists.filter(l => l.name != result.content.name)
			});
		} else {
			this.setState({errmessage: 'It is not possible to delete this list. Error message: ' + result.errmessage})
		}
	}
	
	
	render() {
		return(
			<Layout>
				{this.state.errmessage}
							All saved lists (select which one you want to load):<br/>
							
							<ul>
								{this.state.lists.map((list) => (

									<li><a href={'list/'+list.id}>{list.name}</a> <button type="submit" onClick={this.handleDeleteListSubmit.bind(this, list)}>Delete this list</button></li>
								))}
							</ul>
			</Layout>
		);
	}
}

export default Lists;