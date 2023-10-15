import { Router, Request, Response } from "express";
import isAdmin from "../middleware/adminAuth.middleware";
import GetAllUser from "../controllers/getAllUsers.controller";
import { AuthenticateUser, CreateUser, DeleteUser, GetUser, UpdateUser } from "../controllers/user.controller";
import { PasswordResetHandler, RequestTokenHandler } from '../controllers/reset.controller';
import authorize from "../middleware/authorize.middleware";

let router = Router()

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        path: req.path,
        message: "internal api"
    })
  })

// Create User
router.post('/create', CreateUser);

// Authenticate User
router.post('/authenticate', AuthenticateUser);

// Get User
router.get('/users/:id', authorize, GetUser);

// Update User
router.put('/users/:id', authorize, UpdateUser);

// Delete User
router.delete('/users/:id', authorize, DeleteUser);

// Get All Users (accessible only to admins)
router.get('/users', isAdmin, GetAllUser);

router.post('/reset-password', PasswordResetHandler)
router.post('/confirm-reset', RequestTokenHandler)


export { router };