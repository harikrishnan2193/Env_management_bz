const { DataTypes } = require('sequelize');
const sequelize = require('../DB/connection');

// Create ProjectEnv model
const ProjectEnv = sequelize.define('ProjectEnv', {
    project_env_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    env_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    env_content: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    last_updated: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
    },
}, {
    tableName: 'project_envs',
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_updated',
});

module.exports = ProjectEnv;
