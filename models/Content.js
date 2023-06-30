import { DataTypes } from 'sequelize';

const Content = (sequelize) => {
    return (sequelize.define('content', {
        'id': {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        'name': {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        "type_id": {
            type: DataTypes.INTEGER,
            references: {
                model: "content_types",
                key: "id",
            },
        },
        "watched": {
            type: DataTypes.INTEGER,
            references: {
                model: "watch_dates",
                key: "id",
            },
        },
        'seen': {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }))
};
export default Content;