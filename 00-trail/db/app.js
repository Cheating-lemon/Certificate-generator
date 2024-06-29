const client = require('./database');

// client.connect((err) => {
//     if (err) console.error('Error connecting to the database:', err);
//     else console.log('~Connected to the PostgreSQL database!');
// })
client.connect();


// client.query('SELECT * from users where id=$1 AND name=$2',[1,'Chaitanya'], (err, result) => {
client.query('SELECT * FROM users', (err, result) => {


    if (!err) {

        console.log(result.rows);
        // result.rows.forEach(row => {
        //     console.log(row.name);
        // })
    }
    client.end();
})

// client.connect();
// async function insert(name, id) {
//     client.query('INSERT INTO users(name,id) values($1,$2) RETURNING *', [name,id], (err,result)=>{
//         console.log(result.rows);
//         client.end();
//     })
// }

// insert('John', 5);