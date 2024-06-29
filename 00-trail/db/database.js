const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    port: '5000',
    user: "postgres",
    password: "lemon",
    database: "TestDB"
})

client.on('connect', (err)=>{
    if (err) console.log(err);
    console.log("~ Connected to PostrgreSQL");
})

client.on('end', ()=>{
    console.log("~ Connection closed");
})



module.exports = client;