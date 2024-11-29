const { DataTypes } = require('sequelize')
const sequelize = require('../DB/connection')

//Create Roles model 
const Roles = sequelize.define('Roles', {
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role_scope: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.CHAR(255),
        allowNull: false,
    },
}, {
    tableName: 'roles',
    timestamps: false,
})


module.exports = Roles