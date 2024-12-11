import * as crypto from "crypto";
import * as jwt from "jsonwebtoken"
import { Auth, User } from "../models";

export const SECRET = process.env.ULTRA_SECRET;

export function getSHA256ofString(text:string){
    return crypto.createHash("sha256").update(JSON.stringify(text)).digest("hex");
}
export async function authMiddleware(req, res, next) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log({ token: token });
      try {
        const data = jwt.verify(token, SECRET);
        req.user = data;
        const finded = await Auth.findOne({ where: { id: req.user.id } });
        if (finded === null) {
          res.status(401).json("Token falso");
        } else {
          console.log("Token encontrado ",finded);
          next();
        }
      } catch (e) {
        console.log("err? ", e);
        res.status(401).json({ error: true });
      }
    } else {
      res.status(401).json({ error: "No has enviado ningún token" });
    }
  }