import React, { Component } from 'react';
import { Container } from 'reactstrap';

import { NavMenu } from './NavMenu';

/**
 * CC - navigation for easier tab access
 * Reference: (came from) App.js, (going to) children components.js
*/

export class Layout extends Component {
    static displayName = Layout.name;

    render() {
        return (
            <div>
                <NavMenu />
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}
