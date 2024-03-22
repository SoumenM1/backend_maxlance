require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./routes/authRoutes')
const item = require('./routes/item')
app.use(cors());
app.use(express.json())


app.set('view engine', 'ejs');

app.get('/reset-password', (req, res) => {
    const {token,email}  = req.query;
    if(!token || !email)return res.json({msg:"params missing"})
    res.render('reset-password',{ token, email }); // Assuming you have a reset-password.ejs file in your views directory
  });
  
app.use('/',user)
app.use('/',item)


let PORT=process.env.PORT || 5000;
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`server is running ${PORT}`)
})
