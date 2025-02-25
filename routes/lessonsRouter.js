const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// Создать урок
router.post('/lessons', lessonController.createLesson);

// Получить все уроки
router.get('/lessons', lessonController.getAllLessons);

// Получить урок по ID
router.get('/lessons/:id', lessonController.getLessonById);

// Обновить урок
router.put('/lessons/:id', lessonController.updateLesson);

// Удалить урок
router.delete('/lessons/:id', lessonController.deleteLesson);

module.exports = router;