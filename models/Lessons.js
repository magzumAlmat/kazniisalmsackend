const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./Courses'); // Импорт модели Course

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isReviewLesson: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Course,
      key: 'id',
    },
    onDelete: 'CASCADE', // Если курс удаляется, все его уроки тоже удаляются
  },
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Устанавливаем связь "Один курс - много уроков"
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });


module.exports = Lesson;
