let express = require("express");
let bodyParser = require("body-parser");
let date = require(__dirname + "/date.js"); //importing date.js module

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let listItems = [];
let workItems = [];

//home route
app.get('/', function(req, res) {
  const day = date.getDate();
  res.render("list", {
    listTitle: day,
    newListItems: listItems
  });
});

//POSt req on home route
app.post("/", function(req, res) {
  let userinput = req.body.newItem;

  if (userinput !== "") {
    if (req.body.addButton === 'Work') {
      workItems.push(userinput);
      res.redirect('/work');
    } else {
      listItems.push(userinput);
      res.redirect('/');
    }
  }
  else {
    //pass
  }
});

//work route
app.get('/work', function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

//about route
app.get('/about', function(req, res) {
  res.render("about");
});

app.listen(3000, function(req, res) {
  console.log("Server started at port 3000");
});
