const express = require("express");
const path = require("path");
const app = express();
const List = require("./models/Listing");
const ejsMate = require("ejs-mate");
const override = require("method-override");
const expressError = require("./Utils/ExpressError");
const wrapAsync = require("./Utils/wrapAsync");
// const { scheema } = require("./sheema");
app.set("veiw engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));
app.use(override("_method"));
app.engine("ejs", ejsMate);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Your Server is ${port}`);
});

// const validateList = (req,res,next)=>{
//   let {error}=scheema.validate(req.body)
//   if(error){
//     throw new expressError(401,error)
//   }else{
//     next();
//   }
// }

app.get(
  "/listings",
  wrapAsync(async (req, res,next) => {
    const result = await List.find({});
    res.render("home.ejs", { result });
  })
);

app.get("/", (req, res) => {
  res.send("You are at home page");
});

app.get("/listings/new", (req, res) => {
  res.render("insert.ejs");
});

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const result = await List.findById(id);
    res.render("show.ejs", {result});
  })
);

app.post("/listings", wrapAsync( async (req, res,next) => {
  // let {title,image,description,price,location,country}=req.body;
  // if(!req.body.List){
  //   throw new expressError(400,"Invalid data")
  // }
  // if(!req.body.List.title){
  //   throw new expressError(400,"title is not define")
  // }
  // if(!req.body.List.description){
  //   throw new expressError(400,"description is not define")
  // }
  // if(!req.body.List.location){
  //   throw new expressError(400,"Location is not define")
  // }
  // if(!req.body.List.country){
  //   throw new expressError(400,"country is not define")
  // }
  // if(!req.body.List.price){
  //   throw new expressError(400,"price is not define")
  // }
    const listings = new List(req.body);
    await listings.save();
    res.redirect("/listings");
}));

app.get(
  "/listing/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const result = await List.findById(id);
    res.render("edit.ejs", { result });
  })
);

app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if(!req.body.List){
      throw new expressError(400,"Invalid data")
    }
    let { id } = req.params;
    await List.findByIdAndUpdate(id, {...req.body.List });
    res.redirect(`/listings/${id}`);
  })
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let{status=401,message='Something went wrong'}=err;
    // res.status(status).send(message)
    res.status(status).render('error.ejs',{message})
  // res.send("Something went wrong");
});

const dbConnection = require("./DB/dbConnection");
dbConnection();
