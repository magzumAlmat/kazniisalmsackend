const Course = require('../models/Courses');
const User = require('../auth/models/User');
const Stream = require('../models/Stream');



exports.createStream = async (req, res) => {
  console.log('Creating Stream started');

  try {
    // Находим курс и учителя по ID
    const course = await Course.findByPk(req.body.courseId); // Используем данные из запроса
    const teacher = await User.findByPk(req.body.teacherId); // Используем данные из запроса

    if (!course || !teacher) {
      return res.status(404).json({ error: 'Курс или учитель не найдены' });
    }

    // Создаем новый поток
    const newStream = await Stream.create({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      cost: req.body.cost,
      maxStudents: req.body.maxStudents,
      courseId: course.id,
      teacherId: teacher.id,
    });

    console.log('Новый поток создан:', newStream.toJSON());

    // Отправляем успешный ответ клиенту
    return res.status(201).json({
      message: 'Поток успешно создан',
      stream: newStream,
    });
  } catch (error) {
    console.error('Ошибка при создании потока:', error);
    return res.status(500).json({ error: 'Ошибка сервера при создании потока' });
  }
};


exports.addStudentsToStream = async (req, res) => {
    try {
      const {  studentIds } = req.body;
  
      const {streamId}=req.params
      console.log('streamId= ',streamId,'studentIds= ',studentIds)


      // Находим поток по ID
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }

  
      // Находим студентов по их ID
      const students = await User.findAll({
        where: { id: studentIds, roleId: 3 }, // roleId = 3 для студентов
      });
  
      console.log('students- ',students)

      if (!students.length) {
        return res.status(404).json({ error: 'Студенты не найдены' });
      }
  
      // Добавляем студентов в поток
      await stream.addStudents(students);
  
      return res.status(200).json({
        message: 'Студенты успешно добавлены в поток',
        students: students.map((student) => student.toJSON()),
      });
    } catch (error) {
      console.error('Ошибка при добавлении студентов:', error);
      return res.status(500).json({ error: 'Ошибка сервера при добавлении студентов' });
    }
  };


  exports.getAllStreams = async (req, res) => {
    try {
      const streams = await Stream.findAll({
        include: [
          { model: Course, as: 'course' }, // Включаем данные о курсе
          { model: User, as: 'teacher' }, // Включаем данные об учителе
        ],
      });
  
      if (!streams.length) {
        return res.status(404).json({ error: 'Потоки не найдены' });
      }
  
      return res.status(200).json({
        message: 'Список потоков',
        streams: streams.map((stream) => stream.toJSON()),
      });
    } catch (error) {
      console.error('Ошибка при получении потоков:', error);
      return res.status(500).json({ error: 'Ошибка сервера при получении потоков' });
    }
  };


  exports.getStreamById = async (req, res) => {
    try {
      const { streamId } = req.params;
  
      const stream = await Stream.findByPk(streamId, {
        include: [
          { model: Course, as: 'course' }, // Включаем данные о курсе
          { model: User, as: 'teacher' }, // Включаем данные об учителе
          { model: User, as: 'students' }, // Включаем данные о студентах
        ],
      });
  
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }
  
      return res.status(200).json({
        message: 'Данные о потоке',
        stream: stream.toJSON(),
      });
    } catch (error) {
      console.error('Ошибка при получении потока:', error);
      return res.status(500).json({ error: 'Ошибка сервера при получении потока' });
    }
  };




  exports.updateStream = async (req, res) => {
    try {
      const { streamId } = req.params;
  
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }
  
      const updatedStream = await stream.update({
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        cost: req.body.cost,
        maxStudents: req.body.maxStudents,
      });
  
      return res.status(200).json({
        message: 'Поток успешно обновлен',
        stream: updatedStream.toJSON(),
      });
    } catch (error) {
      console.error('Ошибка при обновлении потока:', error);
      return res.status(500).json({ error: 'Ошибка сервера при обновлении потока' });
    }
  };



  exports.deleteStream = async (req, res) => {
    try {
      const { streamId } = req.params;
  
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }
  
      await stream.destroy();
  
      return res.status(200).json({
        message: 'Поток успешно удален',
      });
    } catch (error) {
      console.error('Ошибка при удалении потока:', error);
      return res.status(500).json({ error: 'Ошибка сервера при удалении потока' });
    }
  };


  exports.removeStudentsFromStream = async (req, res) => {
    try {
      const { studentIds } = req.body;
      const { streamId } = req.params;
  
      const stream = await Stream.findByPk(streamId);
      if (!stream) {
        return res.status(404).json({ error: 'Поток не найден' });
      }
  
      const students = await User.findAll({
        where: { id: studentIds, roleId: 3 },
      });
  
      if (!students.length) {
        return res.status(404).json({ error: 'Студенты не найдены' });
      }
  
      await stream.removeStudents(students);
  
      return res.status(200).json({
        message: 'Студенты успешно удалены из потока',
        students: students.map((student) => student.toJSON()),
      });
    } catch (error) {
      console.error('Ошибка при удалении студентов:', error);
      return res.status(500).json({ error: 'Ошибка сервера при удалении студентов' });
    }
  };