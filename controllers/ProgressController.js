const {Progress}  = require('../models/Progresses');

// Создать запись о прогрессе
exports.createProgress = async (req, res) => {
  try {
    console.log('Create progresses started', req.body)
    const { status, completed_at, user_id, lesson_id} = req.body;

    const progress = await Progress.create({ status, completed_at, user_id, lesson_id });
    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить все записи о прогрессе
exports.getAllProgresses = async (req, res) => {
  try {
    const progresses = await Progress.findAll();
    res.status(200).json(progresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить запись о прогрессе по ID
exports.getProgressById = async (req, res) => {
  try {
    const progress = await Progress.findByPk(req.params.id);
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// exports.getProgressByUserId = async (req, res) => {
//   try {
//     const progress = await Progress.findByPk(req.params.id);
//     if (!progress) {
//       return res.status(404).json({ error: 'Progress not found' });
//     }
//     res.status(200).json(progress);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// Обновить запись о прогрессе
exports.updateProgress = async (req, res) => {
  try {
    const { status, completed_at, userId, lessonId } = req.body;
    const [updated] = await Progress.update(
      { status, completed_at, userId, lessonId },
      { where: { id: req.params.id } }
    );
    if (updated) {
      const updatedProgress = await Progress.findByPk(req.params.id);
      return res.status(200).json(updatedProgress);
    }
    res.status(404).json({ error: 'Progress not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Удалить запись о прогрессе
exports.deleteProgress = async (req, res) => {
  try {
    const deleted = await Progress.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    res.status(404).json({ error: 'Progress not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};