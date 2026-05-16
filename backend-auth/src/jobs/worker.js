// Placeholder for background jobs (BullMQ or node-cron)
// Example: daily report cron
import cron from "node-cron";

export function startJobs() {
  // every day at 6:00
  cron.schedule("0 6 * * *", () => {
    console.log("Running daily jobs...");
  });
}
