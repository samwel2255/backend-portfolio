require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
  const sql = fs.readFileSync(path.join(__dirname, 'migrations', 'schema.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Migrations applied');
  } catch (err) {
    console.error('Migration failed', err);
    process.exitCode = 1;
  } finally {
    client.release();
    process.exit();
  }
}

runMigrations();
