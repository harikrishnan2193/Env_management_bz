const { DataTypes } = require('sequelize')
const sequelize = require('../../core/db/connection')

//Create Organization model 
const Organization = sequelize.define('Organization', {
    organization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'organizations',
    timestamps: false,
})


module.exports = Organization