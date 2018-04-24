var http = require("http");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");
// const MongoClient = require("mongodb").MongoClient
// var ObjectId = require("mongodb").ObjectID;
var request = require("request");
const querystring = require('querystring');
const express = require("express");
const app = express();
const router = express.Router();

const Config = require("./Config");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "/static")));
app.use(express.static(path.join(__dirname, "/../client")));
app.use(express.static(path.join(__dirname, "/../node_modules")));
app.use(express.static(path.join(__dirname, "/../resources")));

function get_folderlist(folder) {
	const is_dir = source => fs.lstatSync(source).isDirectory();
	const getDirectories = source => fs.readdirSync(source).map(name => path.join(source, name)).filter(is_dir);
	let list = getDirectories(path.join(__dirname, "/static/data/", folder));
	return list.map(x => path.basename(x));
}

// -------------------------------------------------------------
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/download/vox/*", function (req, res) {
	let file0 = path.join(__dirname, "/static/homearmen/", req.params["0"]);
	let file1 = path.join(__dirname, "/static/root/", req.params["0"]);
	let files = [file0, file1]
	for (let f in files) {
		if (fs.existsSync(files[f])) {
			res.sendFile(files[f]);
			return;
		}
	}
});


router.get("/", function (req, res) {
    res.redirect(path.join(Config.base_url, "/0"));
});

router.get("/*", function (req, res) {
    res.render("VoxViewer", {
		id_file : req.params["0"]
	});
});

app.use(Config.base_url, router);
module.exports = router;
// -------------------------------------------------------------

let async0 = new Promise((resolve, reject) => {
	resolve();
});


Promise.all([async0]).then( res => {
  const server = http.createServer(app).listen(Config.http_port, function() {
      const host = server.address().address;
          const port = server.address().port;
          console.log("Server listening at address http://%s in port: %s", host, port)
  });
});
