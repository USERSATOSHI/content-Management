import { Router } from "express";
import authRouter from "./auth/index.js";
import { verifyToken } from "../controller/auth/token.js";
import contentRouter from "./content/index.js";
import userRouter from "./user/index.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use(verifyToken);
routes.use("/contents", contentRouter);
routes.use("/users",userRouter);
export default routes;
