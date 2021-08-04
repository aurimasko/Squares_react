import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';

class ImportFile extends React.Component {
		constructor(props) {
			super(props);
			
			this.state = {
				list: [],
				errMessage: null
			};
		}
		
		fetchCoordinates = (line) => {
			let coordinates = line.split(' ');

			if(!coordinates[0] || !coordinates[1] || coordinates[0].trim() == "" || coordinates[1].trim() == "" || isNaN(coordinates[0]) || isNaN(coordinates[1])){
				this.setState({errMessage: 'Some lines was skipped because format of the coordinates was wrong'});
			}else{			
   			  this.setState({list:[...this.state.list, { coordX: coordinates[0], coordY: coordinates[1]}]});}
		}
		
		showFile = async (e) => {
			e.preventDefault()
			this.setState({list:[], errMessage: null});
			
			const reader = new FileReader()
			reader.onload = async (e) => { 
				  const text = (e.target.result)
				  const lines = text.split('\n');
				  
				  lines.map((line) => (this.fetchCoordinates(line)))
			};
			reader.readAsText(e.target.files[0])
		}
		
		render() {
			return(
				<Layout>
					{this.state.errMessage}<br/>
				
					{this.state.list.map((point) => (
												<>
													{point.coordX}, 
													{point.coordY}
													<br/></>
													
											))}
											
					Import file of points:<br/>
					<input type="file" accept=".txt" onChange={(e) => this.showFile(e)}/><br/>
				</Layout>
			);
		}
}

export default ImportFile;