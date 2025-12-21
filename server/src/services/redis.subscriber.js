const redis = require("../config/redis");
const { notifySector } = require("./websocket.service");

redis.psubscribe("sector.*");

redis.on("pmessage", (pattern, channel, message) => {
  const sector = channel.split(".")[1];
  const payload = JSON.parse(message);

  console.log(`Redis event received for sector: ${sector}`);

  notifySector(sector, payload);
});
