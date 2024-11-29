const { DataTypes } = require('sequelize')
const sequelize = require('../DB/connection')

//Create Users model 
const Users = sequelize.define('Organization', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: false,
})


module.exports = Users