import React from 'react';
import { Link } from "react-router-dom";
import '../style.css';

class Layout extends React.Component {
	
	constructor(props) {
		super(props);
							
		this.state = {

			isSaveListButtonClicked: false,
			listName: null
		};
	}


	
	render() {
		return(<>
					<header>
					  <Link to={'/list'} onClick={this.handleUseOther}>Create new list</Link>
					  <Link to={'/lists'} onClick={this.handleUseOther}>Saved lists</Link> 
				   </header>
				  
				   <body>
						{this.props.children}
					</body>
				</>);
	}

}

export default Layout;