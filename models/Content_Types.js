import { DataTypes } from "sequelize";
//import sequelize from "../database.js";

const Content_Types = (sequelize) => {
    return (sequelize.define('content_types', {
        'id': {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        'types': {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }))
};


export default Content_Types;