import React from 'react';
import { Link } from "react-router-dom";
import CurrentList from "./CurrentList";

class Layout extends React.Component {
	
	constructor(props) {
		super(props);
						

	}
	
	render() {
		return(<div>
					<div>
					  <Link to={"/lists"} onClick={this.handleUseOther}>Saved lists</Link> <br/>
					  <Link to={"/importFile"} onClick={this.handleUseOther}>Import file with points</Link> <br/>
				   </div>
				   <br/>
				   
				   <CurrentList/>
				   <br/><br/>
				   <div>
						{this.props.children}
					</div>
				</div>);
	}
}

export default Layout;