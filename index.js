const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { PORT } = process.env;



// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  console.log("DATABASE CONNECTED")
  server.listen(PORT, () => {
    console.log(PORT + ` PORT SUCCESS`);
   
  });
});