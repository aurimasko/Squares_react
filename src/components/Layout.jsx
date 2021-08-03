import React from 'react';
import { Link } from "react-router-dom";
import CurrentList from "./CurrentList";
import { listsService } from "../services/listsService.js";

class Layout extends React.Component {
	
	constructor(props) {
		super(props);
							
		this.state = {

			isSaveListButtonClicked: false,
			listName: null
		};
	}


	
	render() {
		return(<div>
					<div>
					  <Link to={'/list'} onClick={this.handleUseOther}>Create new list</Link><br/>
					  <Link to={'/lists'} onClick={this.handleUseOther}>Saved lists</Link> <br/>
					  <Link to={'/importFile'} onClick={this.handleUseOther} >Import file with points</Link> <br/>
				   </div>
				  
				   <div>
						{this.props.children}
					</div>
				</div>);
	}

}

export default Layout;