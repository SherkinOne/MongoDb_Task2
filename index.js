const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000, function() {
console.log('listening on 3000')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
    // res.render("index")
    })  