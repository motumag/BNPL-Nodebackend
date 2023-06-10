const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const { grantAccess } = require("../middlewares/userVerification");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = "uploads/";
    // Create the directory if it doesn't exist
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
    // cb(null, "uploads/"); // Set the destination directory for uploaded images
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
  editItemById,
  editItemStatus,
  getAllItemsBySalesId,
  editItemUpdateById,
  createItemCategory,
  assignItemToCategory,
  deleteCategory,
  editCategory,
  getAllCategory,
  getCategoryById,
} = require("../controllers/item.controller");
// User routes

router.post(
  "/create",
  grantAccess(["merchant"]),
  upload.single("picture"),
  createNewItem
);
router.get("/getAll", grantAccess(["merchant"]), getAllItems);
router.get(
  "/getAllBySalesId",
  grantAccess(["merchant", "sales"]),
  getAllItemsBySalesId
);
router.get("/getById", grantAccess(["merchant", "sales"]), getItemsById);
router.post("/assigntoSales", grantAccess(["merchant"]), assignItemsToSales);
router.post("/acceptItem", grantAccess(["sales"]), assignItemsToSalesApprove);
router.post(
  "/configureLoanForItem",
  grantAccess(["merchant"]),
  configureLoanForitem
);
router.put(
  "/editItem",
  grantAccess(["merchant"]),
  upload.single("picture"),
  editItemUpdateById
);
router.put("/editItemStatus", grantAccess(["merchant"]), editItemStatus);
router.post(
  "/createItemCategory",
  grantAccess(["merchant"]),
  createItemCategory
);
router.post(
  "/assignItemToCategory",
  grantAccess(["merchant"]),
  assignItemToCategory
);
router.get("/getAllCategories", grantAccess(["merchant"], getAllCategory));
router.get("/getCategoryById", grantAccess(["merchant"], getCategoryById));
router.put("/editCategory", grantAccess(["merchant"], editCategory));
router.delete("/deleteCategory", grantAccess(["merchant"], deleteCategory));

module.exports = router;
