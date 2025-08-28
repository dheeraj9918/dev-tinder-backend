const express = require('express');

const app = express();
app.use('/',(req, res) => {
    res.send("this is the data");
})

app.use('/hello',(req, res) => {
    res.send("this is the data from my server");
})

app.listen(3000, () => {
    console.log("Our server is running successfully on port number 3000 ")
})