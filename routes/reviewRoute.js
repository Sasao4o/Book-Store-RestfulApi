const express = require("express");;
const router = express.Router();
const reviewController = require("../controller/reviewController");
console.log(reviewController.uploadReview)
router.route("/").get(reviewController.getReviews).post(reviewController.uploadReview);
 
router.route("/:id").delete(reviewController.deleteReview).get(reviewController.getReview).patch(reviewController.updateReview);



module.exports = router;
