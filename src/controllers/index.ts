import { getSHA256ofString, SECRET } from "../lib/hooks"
import { User, Auth } from "../models"
import { Transaction, Sequelize } from "sequelize-cockroachdb"
import {v4 as uuidv4} from "uuid"
import * as jwt from "jsonwebtoken";
/* --------------- GET --------------- */
export async function Login(accountData: { email: string; password: string }) {
    const sequelize = Auth.sequelize as Sequelize;
    console.log("Login controller called and received: ", accountData);

    let { email, password } = accountData;

    try {
        return await sequelize.transaction(async (t: Transaction) => {
            // Hashear la contraseña recibida para compararla con la contraseña en la base de datos
            const hashedPassword = getSHA256ofString(password);

            // Verificar si existe el email y la contraseña hasheada en Auth
            const authData = await Auth.findOne({
                where: { email, password: hashedPassword },
                transaction: t
            });

            if (!authData) {
                return { status: 'error', message: 'Email o contraseña incorrecta' };
            }

            // Actualizar el campo 'last_login' en Auth
            const todayDate = new Date();
            const [updatedRowsCount] = await Auth.update(
                { last_login: todayDate },
                { where: { email }, transaction: t }
            );

            if (updatedRowsCount === 0) {
                return { status: 'error', message: 'Error al actualizar la fecha de última sesión' };
            }

            // Obtener los datos del usuario correspondiente usando el id de auth
            const userData = await User.findOne({ where: { id: authData.get("id") }, transaction: t });

            if (!userData) {
                return { status: 'error', message: 'INCONSISTENCIA EN LA BASE DE DATOS: No se encontró usuario asociado al id' };
            }

            // Extraer solo los campos que quieres enviar del modelo User
            const user = userData.get({ plain: true });

            // Generar el token
            const token = jwt.sign({ id: user.id }, SECRET);

            return {
                status: 'success',
                token,
                user: {
                    name: user.name,
                    username: user.username,
                    profile_type: user.profile_type,
                    description: user.description,
                    profile_picture: user.profile_picture,
                },
            };
        });
    } catch (error) {
        console.error("Error durante la transacción: ", error);
        return { status: 'error', message: 'Hubo un problema con el login' };
    }
}
export async function getHomeFeed(){
    console.log("getHomeFeed controller called")
}
export async function getArtistProfile(id){
    console.log("getArtistProfile controlled called and recieved: ", id);
    try{
        const aritstData = await User.findOne({where: {id,}})
        return {aritstData}
    } catch(e){
        console.log("Error: ", e)
    }
    
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
                let todayDate = new Date();

                console.log("Creando nuevo usuario");
                const newUser = await User.create(
                    {
                        id: uuidv4(),
                        name,
                        username,
                        profile_type: "client", // Asegúrate de rellenar este campo
                        created_at: todayDate
                    },
                    { transaction: t }
                );

                console.log("Usuario creado: ", newUser.toJSON());

                console.log("Creando Auth");
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
export async function UpdateProfile(id, accountData: {
    name?: string;
    description?: string;
    profile_picture?: string;
}) {
    console.log("updateProfile controller called and received: ", accountData);

    const sequelize = Auth.sequelize as Sequelize;

    try {
        return await sequelize.transaction(async (t: Transaction) => {
            // Verificar si el usuario existe
            const userData = await User.findOne({
                where: { id: id },
                transaction: t,
            });

            if (!userData) {
                return { status: "error", message: "Usuario no encontrado" };
            }

            // Actualizar directamente los campos recibidos
            const updatedFields = {
                ...accountData,
                updated_at: new Date(), // Actualizar el campo 'updated_at'
            };

            await User.update(updatedFields, {
                where: { id,},
                transaction: t,
            });

            // Retornar los datos actualizado

            return {
                status: "success",
                message: "Perfil actualizado correctamente",
                updatedUser: updatedFields,
            };
        });
    } catch (e) {
        console.error("Error durante la transacción: ", e);
        return { status: "error", message: "Hubo un problema con la actualización" };
    }
}

export async function UpdatePortfolio(accountData){
    console.log("putUpdatePortfolio controller called and recieved: ", accountData)
}