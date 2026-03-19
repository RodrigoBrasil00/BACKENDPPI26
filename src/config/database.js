const mysql = require('mysql2');
require('dotenv').config();

console.log('📁 Configurando conexão com MySQL...');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? '********' : 'VAZIA'}`);
console.log(`   Database: ${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',  
    database: process.env.DB_NAME || 'db_cursos_online',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();


async function testarConexao() {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS resultado');
        console.log('✅ Conexão com MySQL estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MySQL:');
        console.error('   Mensagem:', error.message);
        console.error('   Código:', error.code);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n🔑 SOLUÇÃO:');
            console.error('   1. Verifique se a senha no .env está VAZIA');
            console.error('   2. Arquivo .env deve conter: DB_PASSWORD=');
            console.error('   3. Não coloque espaços ou aspas');
        }
        return false;
    }
}


testarConexao();

module.exports = promisePool;