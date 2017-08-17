import React from 'react';

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return( 
			   <header className="navbar">
			   	<div className="container-fluid">
			   		<h3><a className="navbar-brand" href="#">ToDo App</a></h3>
			   	</div>
			   </header>
			 );
	}
}

export default Header;