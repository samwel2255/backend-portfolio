const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const skillsRouter = require('./routes/skills');
const contactRouter = require('./routes/contact');
const projectsRouter = require('./routes/projects');
const aboutRouter = require('./routes/about');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/skills', skillsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/about', aboutRouter);

app.get('/', (req, res) => res.send({ ok: true, message: 'Wakuru backend' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
