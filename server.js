const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');
const aboutRouter = require('./routes/about');

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  'http://localhost:5173',
  'https://wakuru-portfolio-git-main-wakulu-jumas-projects.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // مثل Postman or mobile apps
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS not allowed for origin: ${origin}`)
      );
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE'],

    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/about', aboutRouter);

/*
|--------------------------------------------------------------------------
| Root Route
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Wakuru backend'
  });
});

/*
|--------------------------------------------------------------------------
| 404 Route
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found'
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    ok: false,
    error: err.message || 'Internal Server Error'
  });
});

/*
|--------------------------------------------------------------------------
| Server
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
