const express = require('express');
const prisma = require('../lib/prisma');
const { success, failure } = require('../services/responses');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: 'desc' }, { id: 'asc' }]
    });

    return success(res, projects);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, tech, github, demo } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        tech: Array.isArray(tech) ? tech : [],
        github,
        demo
      }
    });

    return success(res, project, 201);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech, github, demo } = req.body;

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        tech: Array.isArray(tech) ? tech : [],
        github,
        demo
      }
    });

    return success(res, project);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({ where: { id: Number(id) } });

    return success(res, { deleted: true });
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

module.exports = router;
