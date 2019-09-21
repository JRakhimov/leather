const bodyParser = require("body-parser");
const firebase = require("firebase-admin");
const Express = require("express");
const cors = require("cors");
const path = require("path");

const serviceAccount = require("../firebase.json");

const objectID = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return `${timestamp}xxxxxxxxxxxxxxxx`
    .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
    .toLowerCase();
};

const PORT = 3000;
const app = Express();
const database = firebase
  .initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
  })
  .database();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.set("views", path.join(__dirname, "./public"));
app.use(Express.static(path.join(__dirname, "./public")));
app.set("view engine", "pug");

app.get("/", (req, res) => res.render("index"));

app.post("/", async (req, res) => {
  await database.ref(`users/${objectID()}`).set(req.body);
  return res.render("index");
});

app.get("*", (req, res) => res.status(404).json({ status: false, message: "Not found." }));

app.listen(PORT, () => console.log(`.::Magic happens at ${PORT}::.`));
