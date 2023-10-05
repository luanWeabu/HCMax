const { format } = require("date-fns");

function generateTimestamp() {
  const createdAt = new Date();
  return createdAt;
}
const timestamp = generateTimestamp();
const formattedDate = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss");

module.exports = { generateTimestamp };
