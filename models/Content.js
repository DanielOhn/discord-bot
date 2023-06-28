const { DataTypes } = require("sequelize");

const Content = (sequelize) => {
    return (
        sequelize.define('Content',

            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false,
                },
                content_type: {
                    references: {
                        model: Content_Types,
                        key: "id",
                        deferrable: Deferrable.INITIALLY_IMMEDIATE
                    }
                },
                watched: {
                    references: {
                        model: Watch_Dates,
                        key: "id",
                        deferrable: Deferrable.INITIALLY_IMMEDIATE
                    }
                },
                seen: {
                    type: DataTypes.INTEGER,
                    defaultValue: 0,
                    allowNull: false,
                }
            }))
};

module.exports = Content;