import { Router } from "express";
import { createToken } from "../../controller/auth/token.js";
import { getUserByEmailAndPassword } from "../../controller/user/index.js";

const loginRouter = Router();

function IsValidCredentials(email: string, password: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    const passwordRegex = /^[a-zA-Z0-9]{8,}$/;

    return (
        emailRegex.test(email) &&
        passwordRegex.test(password) &&
        password.length >= 8
    );
}

loginRouter.post("/", async (req, res) => {
    const { email, password } = req.body;

    if (!IsValidCredentials(email, password)) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
    }

    const user = await getUserByEmailAndPassword({email, password});
    if (!user || user.error) return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken({ email, password, username: user.username });

    res.status(200).json({
        data: {
            user,
            token,
        },
    });
});

export default loginRouter;
