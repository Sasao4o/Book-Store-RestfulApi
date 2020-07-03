const express = require("express");;
const router = express.Router();
const bookController = require("../controller/bookController");
const authController = require("../controller/authController");

router.post("/", bookController.uploadBook);

router.get("/",authController.protect, authController.restrictedTo("user"), bookController.getBooks).get("/bestseller", bookController.getBest, bookController.getBooks).get("/:id", bookController.getBook)

router.delete("/:id", bookController.deleteBook);



module.exports = router;
