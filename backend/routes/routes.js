import express from "express";
import { getAllUsers, postNewUser, loginUser, updateUser} from "../controllers/users.js";
import { getAllProducts } from "../controllers/products.js";

const router = express.Router();

//users.js
router.get("/users", getAllUsers);
router.post("/users", postNewUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);

//products.js
router.get("/products", getAllProducts);

export default router;
