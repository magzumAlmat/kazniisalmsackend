const  Lesson  = require('../models/Lessons');

// Создать урок
exports.createLesson = async (req, res) => {
  console.log('Create Lessaon started!',req.body);
  try {
    const { title, content, course_id } = req.body;
    const lesson = await Lesson.create({ title, content, course_id });
    console.log('this is lesson- ',lesson);
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

// exports.getLessonByCourseId = async (req, res) => {
//   try {
//     const lesson = await Lesson.find(req.params.id);
//     if (!lesson) {
//       return res.status(404).json({ error: 'Lesson not found' });
//     }
//     res.status(200).json(lesson);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Обновить урок
exports.updateLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    const [updated] = await Lesson.update(
      { title, content, courseId },
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
    const deleted = await Lesson.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    res.status(404).json({ error: 'Lesson not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};