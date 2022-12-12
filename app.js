const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
  
mongoose.connect('mongodb+srv://Admin-PrithuNarang:Test123@todolistdb.lpahlry.mongodb.net/TodoListDB', {useNewUrlParser:true});


const itemsSchema = {
name: String

}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item ({
    name: "Buy Food"
})



const item2 = new Item ({
    name: "Buy Food item"
})




const item3 = new Item ({
    name: "Buy Food products"
})




const defaultItem = [item1, item2, item3]



const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("list", listSchema);

app.set('view engine', 'ejs');

app.get("/", function(req, res){



    Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
Item.insertMany(defaultItem, function(err){
    if(err){
         console.log(err)
         } else {
         console.log("sucsess")
        }
      })
res.redirect("/")
    } else {
        res.render("list", {listtitle: "Today", Newlistitem: foundItems})
    }
            
            
            
        
    })
    
});


app.get("/:customList", function(req, res){
const customListName= ( req.params.customList);

List.findOne({name: customListName}, function(err, foundList){
    if(!err){
        if(!foundList){
            const list = new List({
                name: customListName,
                items: defaultItem
            })
            
            
            list.save() 
            res.redirect("/" + customListName)
        } else {
            res.render("list", {listtitle: foundList.name, Newlistitem: foundList.items})
        }
    }
})







})



app.post("/", function(req, res){
   const itemName = req.body.newitem
   const listName = req.body.list
const item = new Item ({
    name: itemName
})

if(listName === "Today"){
    item.save()
    res.redirect("/")
} else {
    List.findOne({name: listName}, function(err, foundList){
        foundList.items.push(item)
        foundList.save()
        res.redirect("/" + listName)
    })
}



    
    
})

app.post("/delete", function(req, res){
    const checkedId = req.body.checkbox
    const listName = req.body.listName

    if (listName === "Today"){
        Item.findByIdAndRemove(checkedId, function(err){
            if(!err){
                console.log("sucessfully deleted checked items")
                res.redirect("/")
            }
        })
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName)
            }
        })
    }
    
})

app.listen(process.env.PORT || 3000, function(){
    console.log("the server is running on port 3000.")
  
})