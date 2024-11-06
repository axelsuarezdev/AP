import {Model, DataTypes, Sequelize} from "sequelize";
import { sequelize } from "../sync";

// USERS & RELATED
class User extends Model{}
class Auth extends Model{}

// Constante para ahorrar las propiedades repetidas.
const defaultStringField = ()=>({
    type: DataTypes.STRING,
    allowNull: false,
})
// Constante para ahorrar las propiedades de "id"
const defaultIdField = ()=>({
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
})

// Función auxiliar para 
Auth.init({
    id: defaultIdField(),
    email: defaultStringField(),
    password: defaultStringField(),
    created_at: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    last_login: {
        type: "TIMESTAMP",
    }
},{
    sequelize,
    modelName: "Auth"
})

User.init({
    id: defaultIdField(),
    name: defaultStringField(),
    lastname: defaultStringField(),
},{
    sequelize, 
    modelName: "User"
})

// COMISSIONS & RELATED
class Comission extends Model{}
class Payments extends Model{}

Comission.init({
    id: defaultIdField(),
    artist_id: DataTypes.STRING,
    client_id: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    currency: DataTypes.STRING, // Moneda
    status: DataTypes.ENUM('pending', 'in_progress', 'completed','cancelled'),
    priority_level: DataTypes.ENUM('normal', 'high'),
    preset: DataTypes.BOOLEAN,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    requested_at: {type: "TIMESTAMP"},
    delivery_date: {type: "TIMESTAMP"},
    reference_image: DataTypes.STRING,
}, {sequelize, modelName: ("Comission")})

Payments.init({
    id: defaultIdField(),
    comission_id: {
        type: DataTypes.INTEGER,
    },
    amount: DataTypes.DECIMAL,
    payment_method: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'), // RECONSIDERAR OPCIONES
    payment_status: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    transaction_date: {type: "TIMESTAMP"}
}, {sequelize, modelName: "Payments"})