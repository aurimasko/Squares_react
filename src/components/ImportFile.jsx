import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';

class ImportFile extends React.Component {
		
	render() {
		return(<Layout>
					Import file of points:<br/>
					
					<input type="file" onChange=""/><br/>
				</Layout>
		);
	}
}

export default ImportFile;