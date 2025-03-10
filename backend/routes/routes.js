import express from "express";
import {
  getAllUsers,
  postNewUser,
  loginUser,
  updateUser,
} from "../controllers/users.js";
import {
  getAllProducts,
  createNewProduct,
  foodsAndDrinks,
} from "../controllers/products.js";
import { getLastThreeOrders, createOrder } from "../controllers/orders.js";

const router = express.Router();

//users.js
router.get("/users", getAllUsers);
router.post("/users", postNewUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);

//products.js
router.get("/products", getAllProducts);
router.get("/products/foods-and-drinks", foodsAndDrinks);
router.post("/products", createNewProduct);

//oredrs.js
router.get("/orders/last-three/:id_user", getLastThreeOrders);
router.post("/orders", createOrder);

export default router;
