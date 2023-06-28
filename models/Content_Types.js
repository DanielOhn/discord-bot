const { Sequelize, DataTypes } = require("sequelize");

const Content_Types = (sequelize) => {
    return (sequelize.define('Content_Types', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        types: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }))
};

module.exports = Content_Types;