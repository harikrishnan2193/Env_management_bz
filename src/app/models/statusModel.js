const { DataTypes } = require('sequelize')
const sequelize = require('../../core/db/connection')

//Create status model 
const Status = sequelize.define('Status', {
    status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status_name: {
        type: DataTypes.CHAR(100),
        allowNull: false,
    },

    description: {
        type: DataTypes.CHAR(255),
        allowNull: false,
    },
}, {
    tableName: 'statuses',
    timestamps: false,
})


module.exports = Status