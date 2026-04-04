import cron from "node-cron";
import CreatePaper from "./models/CreatePaper.js";
import Attempt from "./models/Attempt.js";
import Application from "./models/Application.js";
import { sendExamPassSMS } from "./utils/smsService.js";

/**
 * Scheduled task to send result SMS at 11:00 AM daily
 * for exams whose resultDate is today.
 */
export const initScheduledSms = () => {
  // Cron schedule: 0 11 * * * (At 11:00 AM every day)
  // For testing or based on user's "morning 11 pm" (likely 11 AM)
  cron.schedule("0 11 * * *", async () => {
    console.log("🕒 [Cron] Starting scheduled result SMS task at 11:00 AM...");
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // 1. Find tests that are scheduled to show result today and NOT shown instantly
      const tests = await CreatePaper.find({
        resultDate: today,
        showResult: false // If true, they already got instant SMS
      });

      console.log(`🕒 [Cron] Found ${tests.length} tests scheduled for result declaration today (${today}).`);

      for (const test of tests) {
        // 2. Find all successful attempts for this test
        const attempts = await Attempt.find({
          testId: test._id,
          score: { $gte: test.passingMarks || 0 }
        }).populate("applicationId");

        console.log(`🕒 [Cron] Test "${test.title}": Found ${attempts.length} passing candidates.`);

        for (const attempt of attempts) {
          const application = attempt.applicationId;
          if (application && application.mobile) {
            console.log(`🕒 [Cron] Sending result SMS to ${application.candidateName} (${application.mobile})`);
            
            await sendExamPassSMS(
              application.mobile,
              application.applicationNumber,
              attempt.score,
              test.mouStartDate || "N/A",
              test.mouEndDate || "N/A"
            ).catch(err => console.error(`❌ [Cron] Failed to send SMS to ${application.mobile}:`, err));
          }
        }
      }
      
      console.log("🕒 [Cron] Scheduled result SMS task completed.");
    } catch (error) {
      console.error("❌ [Cron] Error in scheduled result SMS task:", error);
    }
  });
};
