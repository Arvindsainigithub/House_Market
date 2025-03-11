const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync");
const List = require("../models/Listing");
const {schema} = require("../sheema");
const expressError = require("../Utils/ExpressError");

const validateList = (req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(401, errMsg);
  } else {
    next();
  }
};

router.get("/new", (req, res) => {
  res.render("insert.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const result = await List.findById(id).populate("reviews");
    res.render("show.ejs", { result });
  })
);

router.post("/",
  validateList,
  wrapAsync(async (req, res, next) => {
    let listings = new List(req.body);
    await listings.save();
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let {id} = req.params;
    const result = await List.findById(id);
    res.render("edit.ejs", { result });
  })
);

router.put(
  "/:id",
  validateList,
  wrapAsync(async (req, res) => {
    if (!req.body) {
      throw new expressError(400, "Invalid data");
    }
    let { id } = req.params;
    await List.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const result = await List.find({});
    res.render("home.ejs", { result });
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

module.exports = router;
