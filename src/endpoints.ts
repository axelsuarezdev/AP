import { sequelize } from "./sync";
import * as express from "express"
import { getAllUsers, getArtistProfile, Login, postRegister, UpdatePortfolio, UpdateProfile } from "./controllers";
import { authMiddleware } from "./lib/hooks";
// APP
const app = express();
const PORT = 5000;
// Force:true hace que no se guarden los datos en la databse, para eso se usa
// alter: true
sequelize.sync({alter: true});
app.use(express.json());

/* --------------- GET --------------- */
app.post("/login", async (req, res)=>{ /* DONE!*/
    // LOGIN -> Cada vez que loguee, actualizar el last_login
    const {email, password} = req.body;
    if (!req.body){
        res.status(400).json("Falta body")
    } else if (!email || !password){
        res.status(400).json("Faltan datos en el body")
    } else if (email && password){
        let response = await Login({email, password});
        res.json(response)
    }
});
app.get("/getArtistProfile/:id", async (req, res)=>{
    // Trae la data del perfil del usuario (User, portfolio, etc)
   let {id} = req.params;
   if (!id){
    res.status(400).json("Falta el id del perfil del artista")
   } else {
    let response = await getArtistProfile(id);
    res.json(response);
   }
});
app.get("/getHomeFeed", ()=>{
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
app.post("/register", async (req, res)=>{ /* DONE!*/
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
app.put("/updateProfile", authMiddleware, async (req, res)=>{
// !!!!!!!! TOKEN -> AUTHMIDDLEWARE
// Recibe la data que quiere cambiar, por lo tanto, deberia ajustar solo ESOS DATOS, Y que se respeten los tipos
// Asegurarse de actualizar el updated_at
let {id, name, description, profile_picture} = req.body;
if (!req.body){
    res.status(400).json("Falta body")
} else if (!id){
    res.status(400).json("Falta el id del usuario")
} else if (name || description || profile_picture){
    let response = await UpdateProfile(id ,{ name, description, profile_picture});
    res.json(response);
}
});

app.put("/updatePortfolio", async ()=>{

});

/* --------------- DELETE --------------- */
app.listen(PORT, ()=>{
    console.log("API Running at ", PORT)
});