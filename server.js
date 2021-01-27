const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const router = express.Router();
const cors = require('cors')
// Make sure you place body-parser before your CRUD handlers!
// app.use(bodyParser.urlencoded({ extended: true }))
//Serves all the request which includes /images in the url from Images folder
// app.use('/images', express.static(__dirname + '/Images'));

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

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
    app.post("/savenewquestion", (req, res) => {
      db.collection("Quiz").insertOne(req.body)
      res.redirect("/addnew");
    });

    app.post("/change", (req, res, next) => {
      res.redirect("/change/1")
      // req.params.page=4
    });

    
    app.get("/change/:page", async (req, res, next) => {
        var perPage = 5
        var page = req.params.page || 1

          db.collection("Quiz")
            .find({})
            .skip((perPage * page) - perPage)
            .limit(perPage).toArray().then((results) => {
            
              res.status(200).render("change.ejs", { questions: results, page: page });
           
              //  console.log(results)
               res.end();
              })
    });


    // app.use("/change",router, cors);
    app.get("/addnew", (req, res) => {
      console.log("addnew");
      //  res.sendFile(__dirname +'/views/addnew.html')

      res.render("./addnew.ejs");
    });
  

  app.post("/records",(req, res) => {
    console.log("body ", req.body);
    if (req.body.action=="Delete"){
      db.collection("Quiz").deleteOne({_id : req.body.id}).then()
    }else {

    }
    
   } );


   })  // end of mongoDB
  .catch((error) => console.error(error));
