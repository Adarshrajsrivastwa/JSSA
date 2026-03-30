import express from 'express';
import { authenticate as auth } from '../middleware/auth.js';
import Attempt from '../models/Attempt.js';

const router = express.Router();

// @route   GET api/test-result
// @desc    Get test results for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id }).populate('testId');

    if (!attempts || attempts.length === 0) {
      return res.json({ message: 'exam not done yet' });
    }

    const testResults = attempts.map(attempt => ({
      id: attempt._id,
      testTitle: attempt.testId.title,
      subject: attempt.testId.subject,
      cls: attempt.testId.class,
      score: attempt.score,
      totalMarks: attempt.testId.totalMarks,
      duration: attempt.testId.duration,
      completedAt: attempt.endTime,
    }));

    res.json(testResults);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
