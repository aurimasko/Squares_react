import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import { listsService } from "../services/listsService.js";

class SavedLists extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			lists: []
		};
	}
	
	async componentDidMount() {
		
		let result = await listsService.fetch();
		
		if (result.isSuccess === true) {

			this.setState({
				lists: result.content
			});
		} else {
			alert(result.Message);
		}
	}

	async handleDeleteListSubmit(list) {
		let result = await listsService.deleteList(list);
		
		if (result.isSuccess === true) {
			this.setState({
				lists: this.state.lists.filter(l => l.name != result.content.name)
			});
		} else {
			alert(result.Message);
		}
	}
	
	render() {
		return(
			<Layout>
				<div class='container'>
					<div class='block'>
						<p>All saved lists (select which one you want to load):</p>

						<ul>
							{this.state.lists.map((list) => (
								<li><a href={'list/'+list.id}>{list.name}</a> <button type="submit" onClick={this.handleDeleteListSubmit.bind(this, list)}>Delete this list</button></li>
							))}
						</ul>
					</div>
				</div>
			</Layout>
		);
	}
}

export default SavedLists;