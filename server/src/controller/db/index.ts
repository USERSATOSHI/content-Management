import { KeyValue } from "@akarui/aoi.db";
import { config } from "dotenv";
config();

const db = new KeyValue({
    dataConfig: {
        path: "./database",
        tables: ["users", "contents"],
    },
    encryptionConfig: {
        encriptData: false,
        securityKey: process.env.securityKey as string,
    },
});

await db.connect();

export default db;
