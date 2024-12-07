import { getSHA256ofString } from "../lib/hooks"
import { User, Auth } from "../models"
import { Transaction, Sequelize } from "sequelize-cockroachdb"
import {v4 as uuidv4} from "uuid"
/* --------------- GET --------------- */
export async function getLogin(accountData){
    console.log("Login controller called and recieved: ", accountData)
}
export async function getHomeFeed(){
    console.log("getHomeFeed controller called")
}
export async function getArtistProfile(id){
    console.log("getArtistProfile controlled called and recieved: ", id)
}
export async function getComissionDetails(accountData){
    console.log("getComissionDetails controller called and recieved: ", accountData)
}
 /* GET: ADMIN */
export async function getAllUsers(){
    const allusers = await User.findAll();
    const authUsers = await Auth.findAll();
    console.log(allusers, authUsers)
    return { allusers, authUsers };
}

/* --------------- POST --------------- */
export async function postRegister(accountData) {
    const sequelize = User.sequelize as Sequelize;
    console.log("Register controller called and received: ", accountData);

    const { email, password, name, username } = accountData;
    if (!email || !password || !name || !username) {
        return { message: "Faltan datos", User: null, Auth: null };
    } else if (password.length <= 8) {
        return { message: "Contraseña demasiado corta, ingresa una nueva con 8 caracteres o más", User: null, Auth: null };
    } else {
        let passwordHasheado = getSHA256ofString(password);

        try {
            return await sequelize.transaction(async (t: Transaction) => {
                console.log("Iniciando transacción");

                // Validar existencia en la tabla User
                const existingUser = await User.findOne({ where: { username }, transaction: t });
                if (existingUser) {
                    console.error("El usuario ya existe en la tabla User");
                    return { message: "El usuario ya existe en la tabla User", User: null, Auth: null };
                }

                // Validar existencia en la tabla Auth
                const existingAuth = await Auth.findOne({ where: { email }, transaction: t });
                if (existingAuth) {
                    console.error("El email ya existe en la tabla Auth");
                    return { message: "El email ya existe en la tabla Auth", User: null, Auth: null };
                }

                console.log("Creando nuevo usuario");
                const newUser = await User.create(
                    {
                        id: uuidv4(),
                        name,
                        username,
                        profile_type: "client", // Asegúrate de rellenar este campo
                    },
                    { transaction: t }
                );

                console.log("Usuario creado: ", newUser.toJSON());

                console.log("Creando Auth");
                let todayDate = new Date();
                const newAuth = await Auth.create(
                    {
                        id: newUser.get("id"),
                        email,
                        password: passwordHasheado,
                        created_at: todayDate,
                        last_login: todayDate,
                    },
                    { transaction: t }
                );

                console.log("Auth creado: ", newAuth.toJSON());

                return {
                    message: "Usuario registrado exitosamente",
                    User: newUser.toJSON(),
                    Auth: newAuth.toJSON(),
                };
            });
        } catch (error) {
            console.error("Error durante la transacción: ", error);
            return { message: "Error al registrar el usuario", User: null, Auth: null };
        }
    }
}


export async function postComission(accountData){
    console.log("postComission controller called and recieved: ", accountData)
}
export async function postArtwork(accountData){
    console.log("postArtwork controller called and recieved: ", accountData)
}

/*  ---------------PUT --------------- */
export async function putUpdateProfile(accountData){
    console.log("updateProfoile controller called and recieved: ", accountData)
}
export async function putUpdatePortfolio(accountData){
    console.log("putUpdatePortfolio controller called and recieved: ", accountData)
}