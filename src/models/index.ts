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
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUID,
    primaryKey: true,
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
    username: defaultStringField(), /* !!! ASEGURARSE EN EL ENDPOINT DE QUE SEA UN STRING SIN ESPACIOS*/
    profile_type: {
       type: DataTypes.STRING,
       defaultValue: "client",
        allowNull: false,
        validate: {
            isIn: [['artist', 'client']],
        },
    },
    description: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    created_at: {type: "TIMESTAMP"},
    updated_at: {type: "TIMESTAMP"},

},{
    sequelize, 
    modelName: "User",
    freezeTableName: true,
})

// COmMISSIONS & RELATED
class Commission extends Model{}
class Payment extends Model{}

Commission.init({
    id: defaultIdField(),
    artist_id: DataTypes.STRING,
    client_id: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    currency: DataTypes.STRING, // Moneda
    status: {
        type: DataTypes.STRING, // Cambia ENUM por STRING
        allowNull: false,
        validate: {
            isIn: [['pending', 'in_progress', 'completed', 'cancelled']], // Restricciones para simular ENUM
        },
    },
    priority_level: {
        type: DataTypes.STRING,
        validate: {
            isIn: [['normal', 'high']]
        }
    },
    preset: DataTypes.BOOLEAN,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    requested_at: {type: "TIMESTAMP"},
    delivery_date: {type: "TIMESTAMP"},
    reference_image: DataTypes.STRING,
}, {
    sequelize, modelName: ("Commission")
})

Payment.init({
    id: defaultIdField(),
    commission_id: {
        type: DataTypes.INTEGER,
    },
    amount: DataTypes.DECIMAL,
    payment_method: {
        type: DataTypes.STRING, // Cambiado a STRING
        allowNull: false,
        validate: {
            isIn: [['credit_card', 'paypal', 'bank_transfer']], // Validación de valores aceptados
        },
    },
    payment_status: {
        type: DataTypes.STRING, // Cambiado a STRING
        allowNull: false,
        validate: {
            isIn: [['pending', 'completed', 'failed', 'refunded']], // Validación de valores aceptados
        },
    },
    transaction_date: {
        type: DataTypes.DATE, // Tipo DATE
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Payment",
});


export {User, Auth, Payment, Commission};