import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/index.js";

const App = express();

App.use(bodyParser.json());
App.use(cors());

App.use(routes);

const server = App.listen(3000, () => {
    console.log("Server is running on port 3000");
});
