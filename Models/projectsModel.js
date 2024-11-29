const { DataTypes } = require('sequelize')
const sequelize = require('../DB/connection')

//Create Projects model 
const Projects = sequelize.define('Projects', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    technology: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'projects',
    timestamps: false,
})


module.exports = Projects