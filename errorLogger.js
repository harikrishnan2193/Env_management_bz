const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "/error.log");

// Function to log errors
function logError(error, route) {
  try {
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, "", "utf8"); // Creating the file if it doesn't exist
    }
    const logMessage = `${new Date().toISOString()} - Error: ${error}\nRoute: ${route}\n\n`;
    fs.appendFileSync(logFilePath, logMessage, "utf8");
  } catch (fsError) {
    console.error("Error while writing to the log file:", fsError.message);
  }
}

module.exports = { logError };
