const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('./models/User');
GOOGLE_CLIENT_ID='301660699750-2fdq5r9nlp6q48dv9gipts4elq4c1n12.apps.googleusercontent.com'
GOOGLE_CLIENT_SECRET='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'
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Настройки для JWT
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
  secretOrKey: 'секретный_ключ', // Секретный ключ для подписи токена
};

// Стратегия для проверки JWT
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id); // Поиск пользователя по ID из токена
      if (user) {
        return done(null, user); // Пользователь найден
      } else {
        return done(null, false, { message: 'Пользователь не найден' }); // Пользователь не найден
      }
    } catch (error) {
      return done(error, false, { message: 'Ошибка при поиске пользователя' }); // Ошибка при поиске пользователя
    }
  })
);

// Локальная стратегия для аутентификации по email и паролю
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Поле для email
      passwordField: 'password', // Поле для пароля
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } }); // Поиск пользователя по email

        if (!user) {
          return done(null, false, { message: 'Пользователь не найден' }); // Пользователь не найден
        }

        const isValidPassword = await bcrypt.compare(password, user.password); // Проверка пароля

        if (!isValidPassword) {
          return done(null, false, { message: 'Неверный пароль' }); // Пароль неверный
        }

        return done(null, user); // Успешная аутентификация
      } catch (error) {
        return done(error, false); // Ошибка при аутентификации
      }
    }
  )
);



passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback", // URL для перенаправления после авторизации
      scope: ['openid', 'email', 'profile'], // Запрашиваемые данные
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Проверяем, существует ли пользователь с таким googleId
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          // Если пользователя нет, создаем нового
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.name.givenName,
            lastname: profile.name.familyName,
            roleId: 3, // Например, роль "пользователь"
          });
        }

        return done(null, user); // Возвращаем найденного или созданного пользователя
      } catch (error) {
        return done(error, false, { message: 'Ошибка при обработке данных Google' });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('User Serialize ', user);
  done(null, user.id); // Сохраняем ID пользователя в сессии
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // Находим пользователя по ID
    console.log('User Deserialized ', user);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


module.exports = {
  jwtOptions,
  passport,
};