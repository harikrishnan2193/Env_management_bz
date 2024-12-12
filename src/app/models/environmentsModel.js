const { DataTypes } = require('sequelize')
const sequelize = require('../../core/db/connection')

//Create Environment model 
const Environment = sequelize.define('Environment', {
    env_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    env_type: {
        type: DataTypes.CHAR(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.CHAR(255),
        allowNull: true,
    },
}, {
    tableName: 'environments',
    timestamps: false,
})


module.exports = Environment