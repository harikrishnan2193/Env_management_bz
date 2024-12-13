const { DataTypes } = require('sequelize');
const sequelize = require('../../core/db/connection')

//Create Permission model 
const Permission = sequelize.define('Permission', {
    permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    env_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    can_view: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    },
    can_edit: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'permissions',
    timestamps: false
});

module.exports = Permission;
