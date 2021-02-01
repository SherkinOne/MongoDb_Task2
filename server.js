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

var ObjectID = require('mongodb').ObjectID;

MongoClient.connect(
  "mongodb+srv://admin:t4pwM36QyAe4F9p!@coursecluster.pzjcy.mongodb.net/Quiz?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("Quiz");

    app.listen(process.env.PORT || 3000, function () {
      console.log("listening on 3000");
    });

    app.get("/", (req, res) => {
      res.render("index.ejs");
    });

    app.get("/aearch", (req, res) => {
      console.log("here");
      db.collection("Quiz")
        .find({ level: req.body.level })
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

    app.get("/change", (req, res, next) => {
      res.redirect("/change/1")
      // req.params.page=4
    });


    app.get("/change/page=:page", async (req, res, next) => {
      var perPage = 5
      var page = req.params.page || 1

      db.collection("Quiz")
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).toArray().then((results) => {
          console.log(results);
          res.status(200).render("change.ejs", { questions: results, page: page });

          //  console.log(results)
          res.end();
        })
    });


    // app.use("/change",router, cors);
    app.get("/addnew", (req, res) => {
      res.render("./addnew.ejs");
    });


    app.post("/records", (req, res) => {
      console.log("body ", req.body);
      idNo = req.body.id
      if (req.body.action == "Delete") {

        // .toString().trim();
        console.log(idNo);
        db.collection("Quiz").deleteOne({ _id: ObjectID(idNo) }).then((results) => {
          console.log(results)
        })
      } else {
        db.collection("Quiz").updateOne({ _id: ObjectID(idNo) },
          {
            $set: {
              newquestion: req.body.newquestion,
              correctAnswer: req.body.correctAnswer,
              answers: req.body.answers,
              skill: req.body.kind,
              category: req.body.category

            }
          }).then((results) => {
            console.log(results)
          });
      }
      res.redirect("/change/1")
    }); // end of set rocrds

    app.get("/answer", (req, res) => {
      console.log
      ("addnew");
      //  res.sendFile(__dirname +'/views/addnew.html')

      res.render("chooseQuizDiffiulty.ejs");
    });

    app.post("/chooseQuiz", (req, res) => {
      console.log(req.body.level);
      db.collection("Quiz")
        .aggregate([
          { $match: { category: req.body.level } }, { $sample: { size: 3 } }])
        .then((results) => {
          let answersArray = [];
          answersArray.push(results.answers[0])
          answersArray.push(results.answers[1])
          answersArray.push(results.correctAnswer);
          answersArray.sort(() => Math.random() - 0.3);
          console.log("Answers ", answersArray)
          res.status(200).render("change.ejs", { questions: results, answers: answersArray });
        });
    });
    
    // app.get("/search", (req, res, next) => {
    //   console.log("search ",req.body)
    //   var perPage = 5
    //   var page = req.params.page || 1
    
    //     console.log("search alll")
    //   db.collection("Quiz")
    //     .find({})
    //     .skip((perPage * page) - perPage)
    //     .limit(perPage).toArray().then((results) => {
    //       // console.log(results);
    //       res.status(200).render("search.ejs", { questions: results, page: page });

    //     });
    // });

    // app.get("/search", (req, res, next) => {
    //   console.log("search ",req.body)
    //   var perPage = 5
    //   var page = req.params.page || 1
    
    //   if ( Object.keys(req.body).length===0){
    //     console.log("search alll")
    //   db.collection("Quiz")
    //     .find({})
    //     .skip((perPage * page) - perPage)
    //     .limit(perPage).toArray().then((results) => {
    //       // console.log(results);
    //       res.status(200).render("search.ejs", { questions: results, page: page });

    
    //     })
    //   }
    //   else {
    //     let searchTerms="";
    //     let searchWordTerms={};
    //     counter=0;

    //     if (req.body.searchWords.length===1 && req.body.searchWords[0]!=""){
    //       counter+=1;
    //       console.log("here 1 ", req.body.searchWords[0])
    //       searchWordTerms={"questiontext" : {$regex : req.body.searchWords[0]}}
    //       console.log("search word ", searchWordTerms)
    //     }
    //     else if (req.body.searchWords && req.body.searchWords.length>1){
    //       counter+=1;
    //       console.log(req.body.searchWords.length>1)
    //       req.body.searchWords.forEach(function (eachSearchWord){
    //         console.log(eachSearchWord)
    //         searchWordTerms=[] ? searchWordTerms+='{"questiontext" : {$regex :'+ eachSearchWord+'}}' :  searchWordTerms+=',{"questiontext" : {$regex :'+ eachSearchWord+' eachSearchWord}}'
    //       })
    //     }
    //     console.log("search word ", searchWordTerms , " : counter ", counter)
      
    //   if( req.body.category!=""){
    //     counter+=1;
    //     console.log("body")
    //     searchTerms+='{"category" : "'+req.body.category+'"}';
    //   }
    //   console.log("176 " ,counter)
    //   if( req.body.skill!=""){
    //     counter+=1;
    //     console.log("skill")
    //     searchTerms+='{ "skill" :"'+req.body.skill+'"  }'
    //   }
  
    //   console.log("182 " ,counter)
    //   searchTerms=JSON.parse(searchTerms);
    //   if (counter>1){
    //     console.log(counter)
    //     searchTerms="{$and ["+searchTerms+"]}"
    //   }
    //   console.log("serach strinf " , searchTerms)
    //   db.collection("Quiz")
    //   .find(searchTerms)
    //   .skip((perPage * page) - perPage)
    //   .limit(perPage).toArray().then((results) => {
    //     console.log(results);
    //     res.status(200).render("search.ejs", { questions: results, page: page });
    //   }); //end of then
    // } //end of if to see length of parameters 
    // // res.end();
    // });

    app.post("/search", (req, res, next) => {
      console.log("search with items ",req.body)
      var perPage = 5
      var page = req.params.page || 1
    
      if ( Object.keys(req.body).length===0){
        console.log("search alll")
      db.collection("Quiz")
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage).toArray().then((results) => {
          // console.log(results);
          res.status(200).render("search.ejs", { questions: results, page: page });

    
        })
      }
      else {
        let searchTerms="";
        let searchWordTerms={};
        counter=0;

        if (req.body.searchWords.length===1 && req.body.searchWords[0]!=""){
          counter+=1;
          console.log("here 1 ", req.body.searchWords[0])
          searchWordTerms={"questiontext" : {$regex : req.body.searchWords[0]}}
          console.log("search word ", searchWordTerms)
        }
        else if (req.body.searchWords && req.body.searchWords.length>1){
          counter+=1;
          console.log(req.body.searchWords.length>1)
          req.body.searchWords.forEach(function (eachSearchWord){
            console.log(eachSearchWord)
            searchWordTerms=[] ? searchWordTerms+='{"questiontext" : {$regex :'+ eachSearchWord+'}}' :  searchWordTerms+=',{"questiontext" : {$regex :'+ eachSearchWord+' eachSearchWord}}'
          })
        }
        console.log("search word ", searchWordTerms , " : counter ", counter)
      
      if( req.body.category!=""){
        counter+=1;
        console.log("body")
        searchTerms+='{ "category" : "'+req.body.category+'"}';
      }
      console.log("176 " ,counter , " : ",searchTerms)
      if( req.body.skill!=""){
        counter+=1;
        console.log("skill")
        searchTerms+='{ "skill" : "'+req.body.skill+'"  }'
      }
  
      console.log("182 " ,counter)
      searchTerms=JSON.parse(searchTerms);
      if (counter>1){
        console.log(counter)
        searchTerms="{$and ["+searchTerms+"]}"
      }
      console.log("serach strinf " , searchTerms)
      db.collection("Quiz")
      .find(searchTerms)
      .skip((perPage * page) - perPage)
      .limit(perPage).toArray().then((results) => {
        console.log(results);
        console.log("new render")
        res.json( { questions: results, page: page });
        
      }).catch((err) =>{
console.log("Errir")
      }) //end of then
    } //end of if to see length of parameters 
    
    });


  })  // end of mongoDB
  .catch((error) => console.error(error));
