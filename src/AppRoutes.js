/**
 * class export vs. export default
 * import Home = export default Home
 * import { Counter } = export class Counter
*/

import ManualList from './components/Manual/ManualList';
import LogViewer from "./components/Log/LogViewer";


/**
 * CC - Browser Router + URL Router mapping
 * Reference: NavMenu.js
*/

const AppRoutes = [
    {
        index: true,
        element: <ManualList />
    },
    { /**
        * CC - �α� ���
        */
        path: '/log-viewer',
        element: <LogViewer />
    }
];

export default AppRoutes;
