/**
 * CC - middlewares and routing
 * PATH: src/servers/server.js
 */

const cors = require('cors');
const express = require('express');
const app = express();

const noteRoutes = require('../routes/noteRoutes');
const logRoutes = require('../routes/logRoutes');
const PORT = process.env.PORT || 5000;


/**
 * CC - JWT = User Login 할때 필요.
 * JSON Web Token to encrpyt/decrypt user PW
*/

const bodyParser = require('body-parser');


/**
 * CC - 여러 Middleware를 사용.
*/

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


/**
 * CC - localhost:5000 테스트용 시스템 기본 샘플
*/

app.get('/', (req, res) => {
    res.send('Hello, world!');
});


/**
 * CC - API Router
 * usersRoutes - Users 관련 라우팅
 * orderRoutes - Monthly Order 관련 라우팅
 * dtRoutes - Downtime 관련 라우팅
*/

app.use('/local', noteRoutes);
app.use('/log', logRoutes);


/**
 * CC - Start the server
*/

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
