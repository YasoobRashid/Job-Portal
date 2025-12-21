require("dotenv").config();
require("./workers/resume.worker");

const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");
const { initWebSocket } = require("./services/websocket.service");



connectDB();


const server = http.createServer(app);


initWebSocket(server);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
