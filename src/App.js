import React from 'react';
import {
		BrowserRouter as Router,
		Switch,
		Route
} from "react-router-dom";

import MainPage from "./components/MainPage";
import Lists from "./components/Lists";
import ImportFile from "./components/ImportFile";
import AddPoint from "./components/AddPoint";

function App() {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={MainPage}/>
				<Route path="/lists" component={Lists}/>
				<Route path="/importFile" component={ImportFile}/>
				<Route path="/addPoint" component={AddPoint}/>
			</Switch>
		</Router>
	);
}
export default App;
