const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Material = require("./Materials"); // Импортируем модель Material

const File = sequelize.define("File", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  material_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "materials",
      key: "material_id",
    },
    allowNull: true,
  },
});

// Устанавливаем связь "многие к одному"
File.belongsTo(Material, {
  foreignKey: 'material_id', // Поле material_id в модели File
  as: 'material', // Алиас для связи
});

module.exports = File;