import React from 'react';
import { Link } from "react-router-dom";
import Layout from './Layout';
import CurrentList from "./CurrentList";

class MainPage extends React.Component {
	
	render() {
		return(<Layout>
				 <br/>
				   <CurrentList/>

				</Layout>);
	}
}

export default MainPage;