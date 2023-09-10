import { Router } from "express";
import { createToken } from "../../controller/auth/token.js";
import { createUser } from "../../controller/user/index.js";

const registerRouter = Router();

function IsValidCredentials(
    email: string,
    username: string,
    password: string,
): boolean {
    const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

    return (
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        password.length >= 8 &&
        username.length > 0
    );
}

registerRouter.post("/", async (req, res) => {
    const { email, username, password } = req.body;

    if (!IsValidCredentials(email, username, password)) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
    }



    const user = await createUser({ email, username, password });
    if(user.error) return res.status(400).json({error: user.error});
        const token = createToken(user as any);

    res.status(200).json({
        data: {
            user:user,
            token,
        },
    });
});


export default registerRouter;