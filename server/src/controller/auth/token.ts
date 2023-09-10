import jwt from "jsonwebtoken";
import { Author, User } from "../../typings.js";
import { config } from "dotenv";

config();

const createToken = (user: User) => {
    const copy = { ...user } as Partial<User>;
    delete copy.password;
    return jwt.sign({ copy }, process.env.jwtKey as string);
};


const verifyToken = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.jwtKey as string) as {
            copy: Omit<User, "username">;
        };
        req.user = decoded.copy;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}

export { createToken, verifyToken };
