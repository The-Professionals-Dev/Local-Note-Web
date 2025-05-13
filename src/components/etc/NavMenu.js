import React from 'react';
import { Navbar, NavbarBrand, NavLink } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';

import MobisLogo from '../../icons/mobis-white.png';
import Book from '../../icons/book-fill.svg';
import Checks from '../../icons/ui-checks.svg';

/**
 * CC - navigation for easier tab access
 * Reference: (came from) Layout.js, (related to) ../AppRoutes.js
*/

export const NavMenu = () => {
    const location = useLocation();

    return (
        <header>
            <Navbar className="navbar" container light>
                <NavbarBrand tag={Link} to="/">
                    <img src={MobisLogo} alt="MES" style={{ height: '40px', width: 'auto' }} />
                </NavbarBrand>
                <ul className="navbar-list">
                    <NavLink tag={Link} to="/" className={`navlink navhover ${location.pathname === "/manual-list" ? "active-nav" : ""}`}>
                        <img src={Book} alt="" className="navicon" />
                        <span className="text-white text-700 navicon-margin">Note</span>
                    </NavLink>

                    <NavLink tag={Link} to="/log-viewer" className={`navlink navhover ${location.pathname === "/log-viewer" ? "active-nav" : ""}`}>
                    <img src={Checks} alt="" className="navicon" />
                        <span className="text-white text-700 navicon-margin">Log</span>
                    </NavLink>
                </ul>
                <NavbarBrand tag={Link} to="/">
                    <div className="text-white text-700 navlink">{'Guest'}</div>
                </NavbarBrand>
            </Navbar>
        </header>
    );
}