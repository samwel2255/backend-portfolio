require('dotenv').config();

const pool = require('./db');

const skills = [
  { name: 'HTML', level: 90, icon: 'bi-filetype-html' },
  { name: 'CSS', level: 88, icon: 'bi-filetype-css' },
  { name: 'JavaScript', level: 86, icon: 'bi-filetype-js' },
  { name: 'React', level: 84, icon: 'bi-cpu' },
  { name: 'Node.js', level: 78, icon: 'bi-diagram-3' }
];

const projects = [
  {
    title: 'Data Visualization Dashboard',
    description:
      'Interactive analytics dashboard showcasing insights with responsive charts and KPI storytelling.',
    tech: ['React', 'D3.js', 'Tailwind'],
    github: '#',
    demo: '#'
  },
  {
    title: 'Machine Learning Classifier',
    description:
      'End-to-end ML workflow for classification with model evaluation and deployment-ready APIs.',
    tech: ['Python', 'Scikit-learn', 'FastAPI'],
    github: '#',
    demo: '#'
  }
];

const about = {
  content:
    'Final-year student engineer specializing in frontend, backend, and data science.',
  extra: 'Focused on building human-centered, intelligent products for real-world impact.'
};

async function seed() {
  try {
    // ensure about.extra exists
    await pool.query("ALTER TABLE about ADD COLUMN IF NOT EXISTS extra TEXT;");

    // insert skills if not present
    for (const s of skills) {
      await pool.query(
        `INSERT INTO skills (name, level, icon)
         SELECT $1, $2, $3
         WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = $1)`,
        [s.name, s.level, s.icon]
      );
    }

    // insert projects if not present
    for (const p of projects) {
      await pool.query(
        `INSERT INTO projects (title, description, tech, github, demo)
         SELECT $1, $2, $3, $4, $5
         WHERE NOT EXISTS (SELECT 1 FROM projects WHERE title = $1)`,
        [p.title, p.description, p.tech, p.github, p.demo]
      );
    }

    // insert about content if table empty
    const res = await pool.query('SELECT id FROM about LIMIT 1');
    if (!res.rows.length) {
      await pool.query('INSERT INTO about (content, extra) VALUES ($1, $2)', [about.content, about.extra]);
    } else {
      // update the existing about row only if content is empty
      const cur = await pool.query('SELECT content, extra FROM about ORDER BY id LIMIT 1');
      const row = cur.rows[0] || {};
      if (!row.content || row.content.trim() === '') {
        await pool.query('UPDATE about SET content=$1, extra=$2 WHERE id=(SELECT id FROM about ORDER BY id LIMIT 1)', [about.content, about.extra]);
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
