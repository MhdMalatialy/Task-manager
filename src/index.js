require('dotenv').config({ path: './config/test.env' })
const app = require ('./app')
const PORT=process.env.PORT
app.listen((PORT),() => {
    console.log("Express server listening on port "+PORT);
  });