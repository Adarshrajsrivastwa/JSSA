import express from 'express';
import { authenticate as auth } from '../middleware/auth.js';
import Attempt from '../models/Attempt.js';
import Application from '../models/Application.js';

const router = express.Router();

// @route   GET api/test-result
// @desc    Get test results (all for admin, personal for applicant)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show personal results
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    const attempts = await Attempt.find(query)
       .populate('testId')
       .populate({
         path: 'applicationId',
         select: 'candidateName mobile email district higherEducation applicationNumber'
       })
       .populate({
         path: 'userId',
         select: 'phone email'
       })
       .sort({ createdAt: -1 });

    if (!attempts || attempts.length === 0) {
      return res.json({ message: 'exam not done yet', results: [] });
    }

    const testResults = await Promise.all(attempts.map(async (attempt) => {
      const test = attempt.testId || {};
      let app = attempt.applicationId || {};
      
      // If applicationId is not linked (old data), try to find application by userId
      if (!attempt.applicationId && attempt.userId) {
        try {
          const foundApp = await Application.findOne({ createdBy: attempt.userId._id || attempt.userId })
            .select('candidateName mobile email district higherEducation applicationNumber')
            .sort({ createdAt: -1 });
          if (foundApp) app = foundApp;
        } catch (e) {
          console.error('Fallback app fetch error:', e);
        }
      }

      const user = attempt.userId || {};
      const totalMarks = test.totalMarks || 100;
      const score = attempt.score || 0;
      const pct = Math.round((score / totalMarks) * 100);
      const passingMarks = test.passingMarks || 0;

      return {
        id: attempt._id,
        student: app.candidateName || 'N/A',
        applicationNumber: app.applicationNumber || 'N/A',
        mobile: app.mobile || user.phone || 'N/A',
        email: app.email || user.email || 'N/A',
        district: app.district || 'N/A',
        education: app.higherEducation || 'N/A',
        testTitle: test.title || 'Deleted Test',
        type: test.type || 'General',
        difficulty: test.difficulty || 'Mixed',
        score: score,
        totalMarks: totalMarks,
        pct: pct,
        duration: test.duration || 0,
        timeTaken: attempt.endTime ? Math.round((new Date(attempt.endTime) - new Date(attempt.startTime)) / 60000) : 0,
        status: score >= passingMarks ? 'pass' : 'fail',
        completedAt: attempt.endTime || attempt.createdAt,
        attempts: 1, 
      };
    }));

    res.json(testResults);
  } catch (err) {
    console.error('Test Result Route Error:', err.message);
    res.status(500).json({ error: 'Server Error', details: err.message });
  }
});

export default router;
