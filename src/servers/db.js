/**
 * CC - DB.js 
 * .env 파일을 불러옵니다.
 * SSMS는 mssql로 씁니다.
*/

require('dotenv').config();
const sql = require('mssql');


/**
 * CC - SQL Server에 연결하는 Configuration 정보.
 * .env에 민감한 정보를 저장해두었기에, .env에서 설정값을 불러와야합니다.
 * 옵션에서 encrpyt 설정을 허용해놓고, HTTPS certificate도 허용해줍니다.
 * 
 * DB port는 1433를 씁니다.
 * DB 권한은 owner 모드로 되어있습니다.
*/

const config = {
    user: process.env.REACT_APP_DB_USER,
    password: process.env.REACT_APP_DB_PW,
    server: process.env.REACT_APP_DB_SERVER,
    database: process.env.REACT_APP_DB_DATABASE,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};


/**
 * CC - DB에 연결하는 function
 * sql connect function을 이용해 DB에 연결을 합니다.
*/

async function connect() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Error connecting to SQL Server:', err.message);
    }
}


/**
 * CC - DB에 연결하는 function
 * pool Promise...
*/

async function poolPromise() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw new Error('Database connection failed');
    }
}

module.exports = { sql, connect, poolPromise };


/**
 * CC - DB쓰는 법
 * Command: npm run server (Path has to be in the Client App folder)
 * Server host at localhost:5000
*/
