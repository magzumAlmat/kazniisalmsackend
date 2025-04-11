const Lesson = require('../models/Lessons');
const User = require('../auth/models/User'); // Импортируем модель User
const { Progress } = require('../models/Progresses');

// Создать урок
exports.createLesson = async (req, res) => {
  console.log('Create Lesson started!', req.body);
  try {
    const { title, content, course_id, isReviewLesson = false } = req.body;
    const lesson = await Lesson.create({ title, content, course_id, isReviewLesson });
    console.log('this is lesson- ', lesson);
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить все уроки
exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить урок по ID
exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findByPk(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновить урок
exports.updateLesson = async (req, res) => {
  try {
    const { title, content, courseId, isReviewLesson } = req.body;
    const [updated] = await Lesson.update(
      { title, content, courseId, isReviewLesson },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedLesson = await Lesson.findByPk(req.params.id);
      return res.status(200).json(updatedLesson);
    }
    res.status(404).json({ error: 'Lesson not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удалить урок
exports.deleteLesson = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('lessonId= ', id);

    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    await Progress.destroy({ where: { lesson_id: id } });
    const deleted = await Lesson.destroy({ where: { id: id } });

    if (deleted) {
      return res.status(204).send();
    }
    res.status(404).json({ error: 'Lesson not found' });
  } catch (error) {
    console.error('Ошибка при удалении урока:', error);
    res.status(500).json({ error: error.message });
  }
};

// Новый метод: отправка отзыва
exports.submitReview = async (req, res) => {
  try {
    const { userId, lessonId, review } = req.body;

    // Проверяем, существует ли урок и является ли он уроком для отзыва
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    if (!lesson.isReviewLesson) {
      return res.status(400).json({ error: 'This lesson is not designated for reviews' });
    }

    // Обновляем поле review в таблице users
    const [updated] = await User.update(
      { review },
      { where: { id: userId } }
    );

    if (updated) {
      const updatedUser = await User.findByPk(userId);
      return res.status(200).json({ message: 'Review submitted successfully', user: updatedUser });
    }
    res.status(404).json({ error: 'User not found' });
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error);
    res.status(500).json({ error: error.message });
  }
};