const { DataTypes } = require("sequelize");

const Watch_Dates = (sequelize) => {
    return (
        sequelize.define('Watch_Dates', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            dates: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: true
            }
        }))
};

module.exports = Watch_Dates;