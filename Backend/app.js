require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Quote = require('./models/Quote');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // e.g. deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// --------------------------- Security constants ---------------------------
const loginAttempts = new Map();
const MAX_ATTEMPTS = 2;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// --------------------------- Database ---------------------------
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// --------------------------- Middleware ---------------------------
function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

function requireTeacher(req, res, next) {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied. Teacher role required.' });
  }
  next();
}

function requireStudent(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied. Student role required.' });
  }
  next();
}

// --------------------------- Routes ---------------------------
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// ---------- Auth ----------
app.post('/auth/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered. Please login.' });
    }

    if (role && !['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be teacher or student.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'student' 
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const attemptKey = `${email}-${clientIP}`;

  try {
    const attempts = loginAttempts.get(attemptKey);
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);
        return res.status(429).json({ 
          error: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
          attemptsLeft: 0,
          lockedUntil: new Date(attempts.lastAttempt + LOCKOUT_DURATION)
        });
      } else {
        loginAttempts.delete(attemptKey);
      }
    }

    const user = await User.findOne({ email });
    if (!user) {
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
      loginAttempts.set(attemptKey, currentAttempts);

      return res.status(400).json({ 
        error: 'User not found',
        attemptsLeft: MAX_ATTEMPTS - currentAttempts.count
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
      currentAttempts.count += 1;
      currentAttempts.lastAttempt = Date.now();
      loginAttempts.set(attemptKey, currentAttempts);

      const attemptsLeft = MAX_ATTEMPTS - currentAttempts.count;
      if (attemptsLeft <= 0) {
        return res.status(429).json({ 
          error: `Too many failed attempts. Try again in ${Math.ceil(LOCKOUT_DURATION / 1000 / 60)} minutes.`,
          attemptsLeft: 0,
          lockedUntil: new Date(Date.now() + LOCKOUT_DURATION)
        });
      }

      return res.status(400).json({ 
        error: 'Invalid credentials',
        attemptsLeft: attemptsLeft
      });
    }

    loginAttempts.delete(attemptKey);
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- Profile ----------
app.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({
      ...user?.profile,
      username: user?.username,
      email: user?.email,
      role: user?.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId, 
      { profile: { name, bio, avatar } }, 
      { new: true }
    );
    res.json(user?.profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Quiz ----------
app.post('/quiz', auth, requireTeacher, async (req, res) => {
  try {
    const quiz = new Quiz({ ...req.body, createdBy: req.user.userId });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/quiz', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/quiz/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/quiz/:id/attempt', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const userId = req.user.userId;
    const userAttempts = quiz.attempts.filter(a => a.userId.toString() === userId.toString());
    if (userAttempts.length >= 2) {
      return res.status(429).json({ error: 'You have used all 2 attempts' });
    }

    const { answers } = req.body;
    if (!answers || answers.length !== quiz.questions.length) {
      return res.status(400).json({ error: 'Invalid answers provided' });
    }

    let score = 0;
    quiz.questions.forEach((q, i) => { if (answers[i] === q.answer) score++; });

    const newAttempt = { userId, score, totalQuestions: quiz.questions.length, answers, attemptedAt: new Date() };
    quiz.attempts.push(newAttempt);
    await quiz.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      attemptNumber: userAttempts.length + 1,
      attemptsRemaining: 2 - (userAttempts.length + 1)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Quotes ----------
app.get('/quote', async (req, res) => {
  try {
    const today = new Date();
    const quote = await Quote.findOne({
      date: { $gte: new Date(today.setHours(0,0,0,0)), $lt: new Date(today.setHours(23,59,59,999)) }
    });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/quote', async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------- Start Server ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
