import { DataTypes } from "sequelize";

const Watch_Dates = (sequelize) => {
    return (
        sequelize.define('watch_dates', {
            'id': {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            "content_id": {
                type: DataTypes.INTEGER,
                references: {
                    model: "contents",
                    key: "id",
                },
            },
            'date': {
                type: DataTypes.DATE,
                allowNull: false,
            }
        }))
};

export default Watch_Dates;