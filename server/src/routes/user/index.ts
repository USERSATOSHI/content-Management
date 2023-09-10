import { Router } from "express";
import { getUserById } from "../../controller/user/index.js";

const userRouter = Router();

userRouter.post("/", async(req, res) => {
    const data = await getUserById(req.body.id);
    if(!data) return res.status(404).json({error: "User not found"});

    res.status(200).json({data});
});

export default userRouter;