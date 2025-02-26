const express = require('express');
const router = express.Router();
const progressController = require('../controllers/ProgressController');
const {createInitialProgress}=require('../controllers/ProgressController')
const { isTeacher, isAdmin } = require('../routes/middlewares');
const Course=require('../models/Courses')
// Создать запись о прогрессе
router.post('/progresses', progressController.createProgress);

// Получить все записи о прогрессе
router.get('/course/progress/:user_id/:course_id', progressController.getCourseProgress);

router.put('/progress/update',progressController.assignProgress)

router.post('/course/enroll', async (req, res) => {
    try {
      const { user_id, course_id } = req.body;
  
      // Проверяем, существует ли курс
      const course = await Course.findByPk(course_id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
  
      // Создаем начальные записи о прогрессе
      await createInitialProgress(user_id, course_id);
  
      res.status(200).json({ message: 'User enrolled in the course successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


router.get('/progress/all/:user_id', progressController.getAllProgressesWithCourseProgress);

// router.get('/progresses/:userid', progressController.getProgressByUserId);
// Получить запись о прогрессе по ID
router.get('/progresses/:id', progressController.getProgressById);

// Обновить запись о прогрессе
router.put('/progresses/:id', progressController.updateProgress);

// Удалить запись о прогрессе
router.delete('/progresses/:id', progressController.deleteProgress);

module.exports = router;