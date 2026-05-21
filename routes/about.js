const express = require('express');
const prisma = require('../lib/prisma');
const { success, failure } = require('../services/responses');
const { requireAdminAuth } = require('../services/adminAuth');

const router = express.Router();

// Get about content (returns first row)
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst({ orderBy: { id: 'asc' } });

    return success(res, {
      content: profile?.bio || '',
      extra: profile?.summary || ''
    });
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

// Update or create about content
// Protect about updates so only authenticated admins can change site copy
router.put('/', requireAdminAuth, async (req, res) => {
  try {
    const { content, extra } = req.body;

    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        bio: content,
        summary: extra
      },
      create: {
        name: 'Wakuru Juma Gilagali',
        title: 'Final-year software developer',
        summary: extra || '',
        bio: content || ''
      }
    });

    return success(res, profile);
  } catch (err) {
    console.error(err);
    return failure(res, 500, 'Database error');
  }
});

module.exports = router;
