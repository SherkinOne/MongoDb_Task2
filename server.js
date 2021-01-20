const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))
//Serves all the request which includes /images in the url from Images folder
// app.use('/images', express.static(__dirname + '/Images'));

app.use(express.static(path.join(__dirname, '/public')))



MongoClient.connect("mongodb+srv://admin:t4pwM36QyAe4F9p!@coursecluster.pzjcy.mongodb.net/Quiz?retryWrites=true&w=majority", { useUnifiedTopology: true
})
.then(client => {
console.log('Connected to Database')
})
.catch(error => console.error(error))




app.listen(3000, function() {
console.log('listening on 3000')
})

app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html')

      db.collection('questions').find().toArray()
      .then(results => {
      console.log(results)
      })
      .catch(error => console.error(error))
      res.render('index.ejs', { quotes: results })

  })  


    app.post('/addQuestion', (req, res) => {
        console.log('Hellooooooooooooooooo!')
        })
        