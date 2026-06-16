const mongoose = require("mongoose");

function getConnectionHelp(error) {
  if (error.message.includes("querySrv")) {
    return [
      error.message,
      "MongoDB Atlas DNS lookup failed. Check your internet connection, DNS, Atlas cluster URL, and Atlas network access settings.",
    ].join(" ");
  }

  return error.message;
}

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file.");
  }

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    throw new Error(getConnectionHelp(error));
  }
}

module.exports = connectDatabase;
