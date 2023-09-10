import { Router } from "express";
import { createContent, deleteContent, getContent, getContents, updateContent } from "../../controller/contents/index.js";

const contentRouter = Router();

contentRouter.post("/",async (req, res) => {
    const data = req.body;
    const content = await createContent(data);

    res.status(201).json({
        data: content
    });
});

contentRouter.get("/", async (req, res) => {
    const data = await getContents();
    res.status(200).json({data});
});


contentRouter.get("/:id", async (req, res) => {
    const data = await getContent(req.params.id);
    if(!data) return res.status(404).json({error: "Content not found"});
    res.status(200).json({data});
});

contentRouter.put("/:id", async (req, res) => {
    const data = req.body;

    await updateContent(req.params.id, data);

    res.status(204).send();
});

contentRouter.delete("/:id", async (req, res) => {
    await deleteContent(req.params.id);

    res.status(204).send();
});

export default contentRouter;
