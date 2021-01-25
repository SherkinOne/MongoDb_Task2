const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const router = express.Router();

// Make sure you place body-parser before your CRUD handlers!
// app.use(bodyParser.urlencoded({ extended: true }))
//Serves all the request which includes /images in the url from Images folder
// app.use('/images', express.static(__dirname + '/Images'));

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

MongoClient.connect(
  "mongodb+srv://admin:t4pwM36QyAe4F9p!@coursecluster.pzjcy.mongodb.net/Quiz?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("Quiz");

    app.listen(3000, function () {
      console.log("listening on 3000");
    });

    app.get("/", (req, res) => {
      res.render("index.ejs");
    });

    app.get("/answer", (req, res) => {
      console.log("here");
      db.collection("Quiz")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.render("answer.ejs", { quotes: results });
        })
        .catch((error) => console.error(error));
    });

// save new question
    app.post("/savenewquestion" ,(req, res) => {
      console.log("here")
      console.log("body " ,req.body);
      db.collection("Quiz").insertOne(req.body)
      res.redirect("/addnew");
    });

app.post("/getnextrecords",  (req, res, next) => {
  console.log("load next records");
  console.log("fitsr : ", req.body)
  res.redirect("/change")
  // req.params.page=4
});

    app.get("/change", async (req, res, next) => {
      console.log("change");
      //  res.sendFile(__dirname +'/views/addnew.html')
      var perPage = 5
      console.log("next ", next)
    
      var page = req.params.page || 1
      console.log("page bo ", page);
      db.collection("Quiz")
          .find({})
          .skip((perPage * page) - perPage)
          .limit(perPage).toArray().then ((results) =>{
            res.render("change.ejs", { questions :  results, page : page });
            console.log(page)
          })
          // .exec(function(err, products) {
          //   db.collection("Quiz").count().exec(function(err, count) {
          //         if (err) return next(err)
          //         res.render('./change.ejs', {
                     
          //             pages: Math.ceil(count / perPage)
          //         })
          //     })
          // })
    });

    app.get("/change/:page", async  (req, res, next) =>{
      try {
      var perPage = 5
      console.log("chang to ", req.params)
      var page = req.params.page || 1
      
      db.collection("Quiz")
          .find({})
          .skip((perPage * page) - perPage)
          .limit(perPage).toArray().then ((results) =>{
            res.render("change.ejs", { questions :  results, page : page });
           console.log(results)
          })
        }
        catch (error){
          return next(error)
        }
    })

    app.get("/addnew", (req, res) => {
      console.log("addnew");
      //  res.sendFile(__dirname +'/views/addnew.html')

      res.render("./addnew.ejs");
    });
  })
  .catch((error) => console.error(error));
