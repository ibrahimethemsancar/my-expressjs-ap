import express from 'express';
import pgPromise from 'pg-promise';
const router =express.Router();
const pgp=pgPromise({});
const app = express();
const port = 3001;
const dotenv = require('dotenv').config();
var db=pgp({
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    port:5432,
    database:process.env.DB_DATABASE,
    ssl:{
      rejectUnauthorized:false
    }
  })


router.route("/")
.all((req,res,next)=>{
  console.log("Request detected ");
  next()
})



.get((req,res)=>{
  db.query('SELECT id,name,surname FROM "MY_USERS"')
.then(function (data) {
  res.send(data)
})
.catch(function (error) {
  res.send(error)
})
})
.post((req,res)=>{
  db.one('INSERT INTO "MY_USERS" (name,surname) VALUES($1,$2) RETURNING id', [req.body.name,req.body.surname],
  (event)=>event.id)
  .then((data)=>
      
      res.send(data)
      )
});


router.get('/:id',(req,res)=>{
    db.one('SELECT id,name,surname FROM "MY_USERS" WHERE id=$1',[req.params.id] )
.then(function (data) {
  res.send(data)
})
.catch(function (error) {
  res.sendStatus(404)
})
  });

router.delete('/:id',(req,res)=>{
    db.query('DELETE FROM "MY_USERS" WHERE id=$1',[req.params.id] )
.then(function (data) {
  res.send(data)
})
.catch(function (error) {
  res.sendStatus(404)
})
});
router.put('/:id',(req,res)=>{
    db.query('UPDATE "MY_USERS" SET name=$1, surname=$2 WHERE id=$3',
    [req.body.name, req.body.surname, req.params.id] )
.then(function (data) {
  res.send(data)
})
.catch(function (error) {
  res.sendStatus(404)
})
}) 

module.exports = router