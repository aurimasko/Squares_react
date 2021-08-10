import React from 'react';
import ReactLoading from "react-loading";
import constants from "../constants.js";
import { fileService } from "../services/fileService.js";

class ImportFile extends React.Component {
		constructor(props) {
			super(props);
			
			this.state = {
				isImportFileEnabled: true
			};
		}
		
		showFile = async (e) => {
			e.preventDefault()
			
			this.setState({isImportFileEnabled: false});
			const result = await fileService.importFile(e.target.files[0]);
			let alertMessage = "";
			
			e.target.value = null;

			if (result.isSuccess == true) {
				if(result.content != null)
				{
					let filteredImportedPoints = result.content.points.filter(p1 => this.props.listPoints.every(p2 => p1.coordX != p2.coordX && p1.coordY != p2.coordY));
					
					if(result.content.points.length != filteredImportedPoints.length) {
						alertMessage = 'There were some points in the file which were already in the list of points. Those points were skipped.\n';
					}
					
					if(this.props.listPoints.length + filteredImportedPoints.length > constants.MAX_LIST_LENGTH) {
						const maxAmountOfPointsFile = constants.MAX_LIST_LENGTH - this.props.listPoints.length;
						
						filteredImportedPoints = filteredImportedPoints.slice(0, maxAmountOfPointsFile);
						
						if(maxAmountOfPointsFile > 0)
							alertMessage += 'Total amount of points is bigger than ' + constants.MAX_LIST_LENGTH + '. Will be imported  as many points as possible up to a maximum of ' + constants.MAX_LIST_LENGTH + '\n';
						else
							alertMessage += 'Total amount of points is bigger than ' + constants.MAX_LIST_LENGTH + '. No points will be imported!\n';
					}
					
					this.props.updateListPoints(this.props.listPoints.concat(filteredImportedPoints));
					this.setState({isImportFileEnabled: true});
									
					if(result.content.skippedLines)
						alertMessage += 'Some lines in the file was skipped because it was presented in the wrong format or duplicated.\n';
					
					if(alertMessage != "")
						alert(alertMessage);
				}
				else
				{
					this.setState({isImportFileEnabled: true});		
					alert('Nothing to import!');
				}
			} else {
				this.setState({isImportFileEnabled: true});
				alert('It is not possible to get file body. Error message: ' + result.message);
			}
		}
		
		render() {
			if(this.state.isImportFileEnabled)
				return(
					<div>
						<h2>Import file of points</h2>
						<input type="file" accept=".txt" onChange={(e) => this.showFile(e)}/><br/>
					</div>
				); 
			else
				return(
					<div>
						<ReactLoading type="balls" color="red" height={50} width={50}/>
					</div>
					);
		}
	
}

export default ImportFile;