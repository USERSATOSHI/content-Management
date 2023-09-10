import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function encrypt(text: string, key: string) {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-ctr", key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString("hex")}.${encrypted.toString("hex")}.${randomBytes(
        16,
    ).toString("hex")}`;
}

export function decrypt(hash: string, key: string) {
    const [iv, encryptedData, _] = hash.split(".");
    const decipher = createDecipheriv(
        "aes-256-ctr",
        key,
        Buffer.from(iv, "hex"),
    );
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData, "hex")),
        decipher.final(),
    ]);
    return decrypted.toString();
}
