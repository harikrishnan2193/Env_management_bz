const fs = require("fs"); //file system module
const path = require("path");

const logFilePath = path.join(__dirname, "/error.log");

// function to log errors
function logError(error, route) {
  try {
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, "", "utf8"); // creating the file if it doesn't exist
    }
    const logMessage = `${new Date().toLocaleString(
      "en-IN"
    )} - Error: ${error}\nRoute: ${route}\n\n`;

    fs.appendFileSync(logFilePath, logMessage, "utf8");
  } catch (fsError) {
    console.error("Error while writing to the log file:", fsError.message);
  }
}

module.exports = { logError };
