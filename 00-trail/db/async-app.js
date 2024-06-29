const client = require('./database');

(async ()=>{
    await client.connect();
    const result = await client.query('SELECT * from users');
    console.log(result.rows);
    client.end();
})();

async function insert(name,id){
    await client.connect();
    const result = await client.query('insert into users(name,id) values($1,$2) RETURNING *', [name,id]);
    console.log(result.rows);
    client.end();
}

// insert('John', 5);
// insert('chetan',0);

