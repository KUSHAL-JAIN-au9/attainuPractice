const express = require('express');
const app = express();
const db = require('./db');
const config = require('./config');
const port = process.env.PORT || 9700;
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
// let con=JSON.parse(config)

app.use(session({
    // config
  secret:'78367326576738'
}));

app.get('/health',(req,res) => {
    res.send("Health Ok")
})



//parse data for post call
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//ejs
app.use(express.static(__dirname+'/public'));
app.set('views','./src/views');
app.set('view engine','ejs');


// app.get('/new',(req,res) => {
//     res.render('admin')
// })

const AutController = require('./src/controller/authController');
app.use('/',AutController)
const postRouter = require('./src/controller/postRoutes');
const { json } = require('body-parser');
const { JsonWebTokenError } = require('jsonwebtoken');
//model of post
app.use('/post',postRouter);




app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})