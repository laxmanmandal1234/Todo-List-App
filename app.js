let express = require("express");
let bodyParser = require("body-parser");
let date = require(__dirname + "/date.js"); //importing date.js module
const mongoose = require("mongoose");
const lo_ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const day = date.getDate();

mongoose.connect("mongodb+srv://admin-laxman:admin123@cluster0.ahlcc.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Learn HTML"
});
const item2 = new Item({
  name: "Learn CSS"
});
const item3 = new Item({
  name: "Learn Javascript"
});

//for custom List on the fly
const listSchema = {
  name: String,
  items: [itemSchema]
}
const List = mongoose.model("List", listSchema);

let defaultListItems = [item1, item2, item3];
let workItems = [];

//home route
app.get('/', function(req, res) {
  Item.find({}, function(err, foundItems) {
    if(foundItems.length === 0){
      Item.insertMany(defaultListItems, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log(foundItems);
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }
  });
});

//work route
// app.get('/work', function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });


//creating custom list using express route parameters
app.get('/:customListTitle', function(req, res) {
  customListTitle = lo_.capitalize(req.params.customListTitle); //capitalizing listname entered by user

  //findOne() method returns a single document while find() returns an array of documents
  List.findOne({name: customListTitle}, function(err, foundList) {
    if(!err) {
      if(!foundList) {
        const customList = new List({
          name: customListTitle,
          items: defaultListItems
        });
        customList.save();
        res.redirect("/" + customListTitle);
      } else {
        res.render("list", {listTitle: customListTitle, newListItems: foundList.items});
      }
    }
  });



});

//about route
app.get('/about', function(req, res) {
  res.render("about");
});

//POST request on home route
app.post("/", function(req, res) {
  let userinput = req.body.newItemField;
  let requestedList = req.body.addButton;

  if (userinput !== "") {
    const newItem = new Item({
      name: userinput
    });

    if (req.body.addButton === day) {
      newItem.save();
      res.redirect('/');

    } else {
      List.findOne({name: requestedList}, function(err, foundList) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + requestedList);
      });
    }
  }
  else {
    //pass
  }
});


app.post('/delete', function(req, res) {
  const checkboxId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === day) {
    Item.findByIdAndRemove(checkboxId, function(err) {
      if(checkboxId !== null && !err) {
        console.log("Successfully deleted item with id = " + checkboxId);
      }
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkboxId}}},
      {new: true},
      function(err, foundList) {
        if(!err) {
          console.log("Successfully deleted " + checkboxId + " from the list " + listName);
          res.redirect("/" + listName);
        }
      }
    );
  }

});

app.listen(3000, function(req, res) {
  console.log("Server started at port 3000");
});
