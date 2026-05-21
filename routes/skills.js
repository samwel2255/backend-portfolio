const express = require('express');
const prisma = require('../lib/prisma');
const { success, failure } = require('../services/responses');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { id: 'asc' } });

    return success(res, skills);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, level, icon } = req.body;

    const skill = await prisma.skill.create({
      data: {
        name,
        level: Number(level) || 0,
        icon
      }
    });

    return success(res, skill, 201);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, level, icon } = req.body;

    const skill = await prisma.skill.update({
      where: { id: Number(id) },
      data: {
        name,
        level: Number(level) || 0,
        icon
      }
    });

    return success(res, skill);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.skill.delete({ where: { id: Number(id) } });

    return success(res, { deleted: true });
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

module.exports = router;
