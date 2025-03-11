const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const override = require("method-override");
const expressError = require("./Utils/ExpressError");
const listing = require("./Routes/listing")
const review = require("./Routes/review")
app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(override("_method"));
app.engine("ejs", ejsMate);
require("dotenv").config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your Server is ${port}`);
});

app.get("/", (req, res) => {
  res.send("You are at home page");
});

app.use("/listings",listing)
app.use("/listings/:id/reviews",review)

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let{status=401,message='Something went wrong'}=err;
    res.status(status).render('error.ejs',{message})
});

const dbConnection = require("./DB/dbConnection");
dbConnection();
