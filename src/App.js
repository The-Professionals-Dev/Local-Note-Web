import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';

import AppRoutes from './AppRoutes.js';
import { Layout } from './components/etc/Layout.js';

import './App.css';


/**
 * CC - App.js
 * Layout ���� �ȿ�, ����� �� Component�� ��������.
 * ������� AppRoutes.js���� Ȯ�� ����.
 * Reference: (came from) Index.js, (going to) Home.js + Layout.js
*/

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Layout>
        );
    }
}
