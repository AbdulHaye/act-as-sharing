const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

require("./src/utils/cronJobs"); // Start cron jobs

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
