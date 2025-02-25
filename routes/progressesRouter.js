const express = require('express');
const router = express.Router();
const progressController = require('../controllers/ProgressController');
const { isTeacher, isAdmin } = require('../routes/middlewares');
// Создать запись о прогрессе
router.post('/progresses', progressController.createProgress);

// Получить все записи о прогрессе
router.get('/progresses', progressController.getAllProgresses);


// router.get('/progresses/:userid', progressController.getProgressByUserId);
// Получить запись о прогрессе по ID
router.get('/progresses/:id', progressController.getProgressById);

// Обновить запись о прогрессе
router.put('/progresses/:id', progressController.updateProgress);

// Удалить запись о прогрессе
router.delete('/progresses/:id', progressController.deleteProgress);

module.exports = router;