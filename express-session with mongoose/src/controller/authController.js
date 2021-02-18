const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const User = require('../model/userModal');



router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json())






// router.get('/',(req,res) => {

//     User.find({ },(err,data) => {
//         if(err) throw err;
//         res.render(data)
//     })
 
// })



// router.get('/new',(req,res) => {
//     res.render('admin')
// })
//getAll User



router.get('/',(req,res) => {
    let errmessage = req.query.errmessage?req.query.errmessage:'';
    let successmessage = req.query.sucmessage?req.query.sucmessage:'';
    res.render('login',{errmessage:errmessage,successmessage:successmessage})
})
router.get('/allUsers',(req,res) => {
    console.log("session>>>",req.session)
    // if(!req.session.user){
    //     return res.redirect('/?errmessage=No Session Found! Please Login Again')
    // }
    // if(req.session.user.role !=="Admin" && req.session.user){
    //     return res.redirect('/post?errmessage=You are Not Admin')
    // }
    User.find((err,data)=>{
        return res.send(data)
        // res.render('users',{data:data,userdata:req.session.user})
    })
});

router.get('/register',(req,res) => {
    let errmessage = req.query.errmessage?req.query.errmessage:'';
    res.render('register',{errmessage:errmessage})
})

//register
router.post('/register',(req,res)=>{
    var hashedpassword = bcrypt.hashSync(req.body.password,8);
    let user={
        name: req.body.name,
        city: req.body.city,
        phone: req.body.phone,
        isActive: req.body.isActive?req.body.isActive:true,
        role: req.body.role?req.body.role:'User',
        email: req.body.email,
        password:hashedpassword
    }
    User.findOne({email:user.email},(err,data) => {
        if(data){
            return res.redirect("/register?errmessage=Email Already Taken Added")  
        }else{
            User.create(user,(err,data)=>{
                if(err) throw err;
                //return res.send("Data Added")
                res.redirect("/?sucmessage=Successfully Register")  
            })
        }
    })
})

//login
router.post('/login',(req,res) => {
    let user={
        email:req.body.email,
        password:req.body.password
    }
 
    User.findOne({email:req.body.email},(err,user) => {
        if(err || !user){
            return res.redirect('/?errmessage=Invalid Login! Please Try Again')
        }else
            //save data in session
            /*if(req.session.user.email = data.email){
                
            }*/
            req.session.user = user;
            console.log(req.session.user)
            console.log("login>>>",req.session)
            const passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid)
            {
              res.status(401).send('Invalid Password')
            }else
     
         
            //  res.send("ok")
          res.redirect('/post')
        
        
    })
})
// //profile
// router.get('/userInfo',(req,res) => {
//     var token = req.headers['x-access-token'];
//     if(!token) res.send({auth:false,token:'No Token Provided'})
//     jwt.verify(token,config.secert,(err,data) => {
//         if(err) return res.status(500).send({auth:false, "error":'Invalid Token'})
//         User.findById(data.id,{password:0},(err,result) => {
//             res.send(result)
//         })
//     })
// })

//UserDetails
router.get('/user/:id',(req,res) => {
    var id = req.params.id
    var query = {}
    query={_id:id}
    User.findOne({ query },(err,data) => {
        if(err) throw err;
        res.send(data)
    })
  
})



//updateUser
router.put('/editUser',(req,res) => {
    let Id = req.body._id;
  User.update(
        {_id:Id},
        {
            $set:{
                name:req.body.name,
                email:req.body.email,
                city: req.body.city,
                phone: req.body.phone,
                isActive:req.body.isActive?true:false,
                role: req.body.role,
            }
        },(err,result) => {
            if(err) throw err;
            res.send("Data Updated")
        }
    )
})

//hardDeleteUser
router.delete('/deleteUser',(req,res) => {
    let Id = req.body._id
    User.remove({_id:Id},(err,result) => {
        if(err) throw err;
        res.send("Data Deleted")
    })
});

//deactivate User(soft Delete)
router.put('/deactivateUser',(req,res)=>{
    let Id = req.body._id
   User.updateOne(
        {_id:Id},
        {
            $set:{
                isActive:false
            }
        },(err,result)=> {
            if(err) throw err;
            res.send("User Deactivated")
        }
    )
})

//Activate User(soft Delete)
router.put('/activateUser',(req,res)=>{
    let Id = mongo.ObjectID(req.body._id);
   User.updateOne(
        {_id:Id},
        {
            $set:{
                isActive:true
            }
        },(err,result)=> {
            if(err) throw err;
            res.send("User Activated")
        }
    )
})


module.exports = router;