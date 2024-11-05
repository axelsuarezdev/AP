import {Model, DataTypes} from "sequelize";

// USERS & RELATED
class User extends Model{}
class Auth extends Model{}

Auth.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }
},{
    sequelize,
    modelName: "Auth"
})



// COMISSIONS & RELATED
class Comission extends Model{}
class Payments extends Model{}