import { DataTypes } from 'sequelize';

const Channels = (sequelize) => {
    return (sequelize.define('channels', {
        'id': {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        'guild_id': {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        "channel_id": {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    }))
};
export default Channels;