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
        "media": {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "Movie",
        },
        'seen': {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    }))
};
export default Content;