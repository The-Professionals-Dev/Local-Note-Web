import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.js';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

/** 
 * CC - root, ������ ������.
 * Browser Router�� URL + Tab �ڵ鸵 ����.
 * �⺻ Ʋ���� ��������.
*/

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <BrowserRouter basename={baseUrl}>
        <App />
    </BrowserRouter>);
