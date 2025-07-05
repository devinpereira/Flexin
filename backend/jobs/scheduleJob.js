import cron from "node-cron";
import generateSchedulesForAllUsers from "./scheduleGenerator.js";

const initCronJobs = () => {
  cron.schedule('0 0 * * 0', () => {
    console.log('Weekly job running...');
    generateSchedulesForAllUsers();
  });
};

export default initCronJobs;
