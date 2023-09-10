import { decrypt, encrypt } from "../../misc/hash.js";
import db from "../db/index.js";
import { randomBytes } from "crypto";
const createUser = async ({
    email,
    username,
    password,
}: {
    email: string;
    username: string;
    password: string;
}) => {
    const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!emailRegex.test(email)) return { error: "Invalid email" };
    if (!usernameRegex.test(username)) return { error: "Invalid username" };
    if (password.length < 8) return { error: "Password too short" };

    const user = await db.findOne("users", (data) => {
        return data.value.email === email;
    });

    if (user) return { error: "User already exists" };
    const encryptedPassword = encrypt(
        password,
        process.env.securityKey as string,
    );
    const id = randomBytes(16).toString("hex");
    const newUser = {
        id,
        email,
        username,
        password: encryptedPassword,
        contents: [],
    };

    await db.set("users", id, { value: newUser });
    return {...newUser, password: undefined};
};

const getUserByEmailAndPassword = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const user = await db.findOne("users", (data) => {
        const decryptedPassword = decrypt(
            data.value.password,
            process.env.securityKey as string,
        );

        return data.value.email === email && decryptedPassword === password;
    });

    if (!user) return { error: "User not found" };
    if (user.value.password !== password) return { error: "Invalid password" };

    const contents = [];
    for (const contentId of user.value.contents) {
        const content = await db.get("contents", contentId);
        if (content) contents.push(content.value);
    }

    return { ...user.value, contents };
};

const getUserById = async (id: string) => {
    const data =  (await db.get("users", id))?.value;

    const contents = [];
    for (const contentId of data.contents) {
        const content = await db.get("contents", contentId);
        if (content) contents.push(content.value);
    }

    return { ...data, contents };
};


const updateUser = async (id: string, data: any) => {
    const user = await getUserById(id);
    return await db.set("users", id, {
        value: { ...user, ...data },
    });
}

const deleteUser = async (id: string) => {
    const user = await getUserById(id);
     await db.delete("users", id);

    for (const contentId of user.contents) {
        await db.delete("contents", contentId);
    }
}

export { createUser, getUserByEmailAndPassword, getUserById, updateUser, deleteUser };