const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
var items = ["Buy food", "Cook Food", "Eat Food"]
var workitems = ["do home work ", "practice programing", "study for exams"]
app.set('view engine', 'ejs');

app.get("/", function(req, res){

    var today = new Date()

var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"

};
var day = today.toLocaleDateString("en-US", options)
    res.render("list", {listtitle: day, Newlistitem: items})
    
 
})
app.post("/", function(req, res){
    var data = req.body.newitem


if(req.body.list === "work"){
    workitems.push(data);
    res.redirect("/work")
}else{
    items.push(data) 
    res.redirect("/")
}

    
    
})

app.get("/work", function(res, res){
    res.render("list", {listtitle: "work", Newlistitem:  workitems})
})
app.post("/work", function(req, res){
    var data = req.body.newitem
    workitems.push(data)
    res.redirect("/work")
})

app.listen(process.env.PORT || 300, function(){
    console.log("the server is running on port 3000.")
  
})