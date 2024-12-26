const { DataTypes } = require('sequelize')
const sequelize = require('../../core/db/connection')

const Env_History = sequelize.define('Env_History', {
    history_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    history_view: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'env_history',
    timestamps: false, 
  });
  
  module.exports = Env_History;