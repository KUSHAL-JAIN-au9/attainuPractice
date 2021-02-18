//controller
var express = require('express');
var postRouter = express.Router();
// const mongodb = require('mongodb');
const User = require('../model/userModal');
const Post = require('../model/postModel');

const bodyParser = require('body-parser');

// const url = "mongodb://localhost:27017";
// var mongoClient = new mongodb.MongoClient(url);
// let dbobj;

// mongoClient.connect({},(err) => {
//     if(err) throw err;
//     dbobj = mongoClient.db('aryablog')
// });


function postpage(){

    postRouter.use(bodyParser.urlencoded({extended:true}));
    postRouter.use(bodyParser.json())

    
    postRouter.route('/')
    .get((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }
        Post.find({isActive:true},(err,data) => {
            //res.send({postdata:data,userdata:req.session.user})
            res.render('post',{postdata:data,userdata:req.session.user})
        })
    })


    postRouter.route('/displayAdd')
    .get((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }else{
            let user = req.session.user;
            let err = req.query.errmessage?req.query.errmessage:''
            res.render('addPost',{userdata:user,errmessage:err})
        }
    })

    postRouter.route('/addPost')
        .post((req,res) => {
            
            if(!req.session.user){
                res.redirect("/?errmessage=No Session Found! Please try again")
            }
            console.log(req.body)
            let data = {
                title:req.body.title,
                description:req.body.description,
                createBy:req.session.user.name,
                createrId:req.session.user._id,
                isActive:true,
                tags:req.body.tags,
                date:new Date(Date.now()).toISOString(),
                lastupdatedate:new Date(Date.now()).toISOString()
            }

            Post.create(data,(err,result)=>{
                result.redirect('/post')
            })
    })

    //editpost
    postRouter.route('/edit/:id')
    .get((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }
        let Id = mongodb.ObjectID(req.params.id);
       Post.findOne({_id:Id,isActive:true},(err,data) => {
            console.log("edit data>>>",data)
            res.render('edit',{data,userdata:req.session.user})
        })
    })

    //updatepost
    postRouter.route('/editPost/:id')
    .post((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }
        let Id = mongodb.ObjectID(req.params.id);
       User.updateOne(
            {_id:Id},
            {
                $set:{
                    title:req.body.title,
                    description:req.body.description,
                    tags:req.body.tags,
                    lastupdatedate:new Date(Date.now()).toISOString()
                }
            },(err,result) => {
                if(err) throw err;
                res.redirect('/post')
            }
        )
    })

    //delete user
    postRouter.route('/deletePost/:id')
    .get((req,res) => {
        if(!req.session.user){
            res.redirect("/?errmessage=No Session Found! Please try again")
        }
        let Id =req.params.id;
      Post.remove({_id:Id},(err,result) => {
                if(err) throw err;
                res.redirect('/post')
        })
    })

    return postRouter;
}



module.exports = postpage