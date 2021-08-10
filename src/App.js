import React from 'react';

import {
		BrowserRouter as Router,
		Switch,
		Route
} from "react-router-dom";

import List from "./components/List";
import SavedLists from "./components/SavedLists";

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/lists" component={SavedLists}/>
				<Route path={["/list/:id", "/list/", "/"]} component={List}/>
			</Switch>
		</Router>
	);
}
export default App;
