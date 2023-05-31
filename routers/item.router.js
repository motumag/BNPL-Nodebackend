const express = require("express");
const multer = require("multer");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set the destination directory for uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});
// Create the Multer upload instance
const upload = multer({ storage: storage });

// Import your controllers
const {
  createNewItem,
  getAllItems,
  getItemsById,
  assignItemsToSales,
  assignItemsToSalesApprove,
  configureLoanForitem,
  editItemById
} = require("../controllers/item.controller");
// User routes

router.post(
  "/create",
  grantAccess(["merchant"]),
  upload.single("picture"),
  createNewItem
);
router.get("/getAll", grantAccess(["merchant", "sales"]), getAllItems);
router.get("/getById", grantAccess(["merchant", "sales"]), getItemsById);
router.post("/assigntoSales", grantAccess(["merchant"]), assignItemsToSales);
router.post("/acceptItem", grantAccess(["sales"]), assignItemsToSalesApprove);
router.post(
  "/configureLoanForItem",
  grantAccess(["merchant"]),
  configureLoanForitem
);
router.put("/editItem", grantAccess(["merchant"]), editItemById);
module.exports = router;
