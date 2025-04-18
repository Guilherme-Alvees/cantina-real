import express from "express";
import {
  getAllUsers,
  postNewUser,
  loginUser,
  updateUser,
  updateAdminStatus,
} from "../controllers/users.js";
import {
  getAllProducts,
  createNewProduct,
  foodsAndDrinks,
  deleteOneProduct,
  editOneProduct,
} from "../controllers/products.js";
import { getLastThreeOrders, createOrder } from "../controllers/orders.js";

const router = express.Router();

//users.js
router.get("/users", getAllUsers);
router.post("/users", postNewUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.put("/users/:id/admin", updateAdminStatus);

//products.js
router.get("/products", getAllProducts);
router.get("/products/foods-and-drinks", foodsAndDrinks);
router.post("/products", createNewProduct);
router.delete("/products/:id", deleteOneProduct);
router.put("/products/:id", editOneProduct);

//oredrs.js
router.get("/orders/last-three/:id_user", getLastThreeOrders);
router.post("/orders", createOrder);

export default router;
