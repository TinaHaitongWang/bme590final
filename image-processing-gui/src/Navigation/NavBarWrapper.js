import React from 'react';
import NavItem from './NavItem';
import './NavBarWrapper.css'

const NavBar = (props) => (
    <div>
        <ul className="NavBar">
            <NavItem link="/">Input</NavItem>
            <NavItem link="/results">Output</NavItem>
        </ul>
        {props.children}
    </div>
);

export default NavBar;