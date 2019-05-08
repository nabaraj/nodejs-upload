var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var multer = require("multer");
var path = require("path");
hbs = require("express-handlebars");
let fileName = "";
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
var Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/images");
  },
  filename: function(req, file, callback) {
    fileName = file.fieldname + "_" + Date.now() + "_" + file.originalname;
    callback(null, fileName);
  }
});
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutDir: __dirname + "/views/layouts/"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

var upload = multer({
  storage: Storage
}).array("file", 3); //Field name and max count

app.get("/index.html", function(req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});
app.get("/test", function(req, res) {
  res.send("Hello World");
});
app.get("/fileupload.html", function(req, res) {
  res.sendFile(__dirname + "/" + "fileupload.html");
});
app.post("/process_post", urlencodedParser, function(req, res) {
  // Prepare output in JSON format
  response = {
    first_name: req.body.first_name,
    last_name: req.body.last_name
  };
  //console.log(response);
  res.end(JSON.stringify(response));
});

app.post("/file_upload", function(req, res) {
  console.log("file upload", req);
  upload(req, res, function(err) {
    if (err) {
      return res.end("Something went wrong!");
    }
    //console.log(res);
    return res.render("index", {
      title: "cool, huh",
      condition: false,
      anyArray: [1, 2, 3, 4],
      src: fileName
    });
  });
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
