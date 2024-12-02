import { sequelize } from "./sync";
import * as express from "express"
import { getAllUsers, postRegister } from "./controllers";
// APP
const app = express();
const PORT = 5000;
sequelize.sync({force: true});
app.use(express.json());

/* --------------- GET --------------- */
app.get("/login", ()=>{
    // LOGIN -> Cada vez que loguee, actualizar el last_login
});
app.get("/getHomeFeed", ()=>{
    // LOGIN -> Cada vez que loguee, actualizar el last_login
});
app.get("/getArtistProfile/:id", ()=>{
    // LOGIN -> Cada vez que loguee, actualizar el last_login
});
app.get("/getComissionDetails/:id", ()=>{
    // LOGIN -> Cada vez que loguee, actualizar el last_login
});

// ADMIN
app.get("/getAllUsers", async (req,res)=>{
    console.log("Endpoint: getAllUsers called");

    const response = await getAllUsers();
    res.json(response);
});







/* --------------- POST --------------- */
app.post("/register", async (req, res)=>{
    console.log("register recibió: ", req.body)
    // Si no tiene un body devuelve un 400
    if (!req.body){
        res.status(400).json({message: "Faltan datos en el body"})
    }
    // en el caso de ser true, sigue con la operación.
    else {
        // Esto debe devolver 'res'
        const response = await postRegister(req.body.accountData);
        res.json(response);
    }
});






app.post("/postComission", ()=>{
    // 
});
app.get("/postArtwork", ()=>{
    // 
});
/* --------------- PUT --------------- */

/* --------------- DELETE --------------- */
app.listen(PORT, ()=>{
    console.log("API Running at ", PORT)
});