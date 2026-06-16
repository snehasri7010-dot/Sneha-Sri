const app = require("./app");
const connectDatabase = require("./config/database");
require("dns").setServers(["1.1.1.1"]);

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Car rental API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
