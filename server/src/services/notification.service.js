const Redis = require("ioredis");
const { notifySector } = require("./websocket.service");

const subscriber = new Redis();

subscriber.psubscribe("sector.*");

subscriber.on("pmessage", (pattern, channel, message) => {
  const sector = channel.split(".")[1];
  const payload = JSON.parse(message);

  notifySector(sector, payload);
});
