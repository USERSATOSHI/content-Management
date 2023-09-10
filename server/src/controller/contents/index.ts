import { randomBytes } from "crypto";
import db from "../db/index.js";
import { getUserById, updateUser } from "../user/index.js";

const createContent = async ({
    title,
    summary,
    content,
    author,
}: {
    title: string;
    summary: string;
    content: string;
    author: {
        id:string,
        username:string,
    };
}) => {
    const id = randomBytes(16).toString("hex");
    const newContent = {
        id,
        title,
        summary,
        content,
        author:  author,
    };

    await db.set("contents", id, { value: newContent });
    const user = await getUserById(author.id);

    await updateUser(author.id, {
        contents: [...user.contents.map((x: { id: any; }) => x.id), id],
    });
    return newContent;
}

const getContents = async () => {
    return (await db.all("contents"))?.map((content) => content.value);
}

const  getContent = async (id: string) => {
    return (await db.get("contents", id))?.value;
}

const updateContent = async (id: string, data: any) => {
    const content = await getContent(id);
    return await db.set("contents", id, {
        value: { ...content, ...data },
    });
}

const deleteContent = async (id: string) => {
    const content = await getContent(id);
    await db.delete("contents", id);

    await updateUser(content.author.id, {
        contents: content.author.contents.filter((contentId: string) => {
            return contentId !== id;
        }),
    });
}

export { createContent, getContents, getContent, updateContent, deleteContent };
