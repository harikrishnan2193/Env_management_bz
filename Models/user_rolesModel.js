const { DataTypes } = require('sequelize');
const sequelize = require('../DB/connection');
const User = require('./usersModel');
const Roles = require('./rolesModel');
const Organization = require('./organizationsModel'); 


// Create user_roles model 
const User_roles = sequelize.define('User_roles', {
    user_role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    organization_id: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    project_id: {
        type: DataTypes.CHAR(36),
        allowNull: true,
    },
    assigned_by: {
        type: DataTypes.CHAR(36),
        allowNull: true,
    },
    assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'user_roles',
    freezeTableName: true, 
    timestamps: false
});

// define associations
User_roles.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); // User_Roles -> User
User_roles.belongsTo(Roles, { foreignKey: 'role_id', as: 'role' }); // User_Roles -> Roles

module.exports = User_roles;
