import { Router } from "express";
import transactionController from "./controllers/TransactionController";
import categoryController from "./controllers/CategoryController";
import accountController from "./controllers/AccountController";
import userController from "./controllers/UserController";
import { authenticate, getUser } from "./middlewares/authMiddleware";
import roleMiddleware from "./middlewares/roleMiddleware"; // Import the roleMiddleware
import Role from "./constants/roles";

const router = Router();

// Public routes
router.post("/signup", userController.signUp);
router.post("/login", userController.logIn);

// Middleware to apply authentication to all subsequent routes
router.use(authenticate);

// Middleware to get user information from the token
router.use(getUser);

// Protected routes
router.get("/transactions", transactionController.getAll);
router.post("/transactions", transactionController.create);
router.put("/transactions/:id", transactionController.update);
router.delete("/transactions/:id", transactionController.delete);

router.get("/categories", categoryController.getAll);
router.post("/categories", categoryController.create);
router.put(
  "/categories/:id",
  roleMiddleware([Role.ADMIN]),
  categoryController.update
); // Apply roleMiddleware to the update route
router.delete(
  "/categories/:id",
  roleMiddleware([Role.ADMIN]),
  categoryController.delete
); // Apply roleMiddleware to the delete route

router.get("/accounts", accountController.getAll);
router.post("/accounts", accountController.create);
router.put(
  "/accounts/:id",
  roleMiddleware([Role.ADMIN]),
  accountController.update
); // Apply roleMiddleware to the update route
router.delete(
  "/accounts/:id",
  roleMiddleware([Role.ADMIN]),
  accountController.delete
); // Apply roleMiddleware to the delete route
router.get(
  "/accounts/:accountId/transactions",
  roleMiddleware([Role.ADMIN, Role.MANAGER]),
  transactionController.getAllByAccount
);
export default router;
