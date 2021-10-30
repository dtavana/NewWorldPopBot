const Axios = require("axios");
const { Client, Intents } = require("discord.js");

// Found from the /worlds endpoint
const WORLD_IDENTIFIER = "eden";
// Base URL for API
const BASE_URL = "https://firstlight.newworldstatus.com/ext/v1";
// API Token
const API_TOKEN = "";
// Bot Token
const BOT_TOKEN = "";
// Refresh rate in seconds for status update
const REFRESH_RATE = 60;

const apiClient = Axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: API_TOKEN },
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const updateStatus = async () => {
  const data = await apiClient.get(`/worlds/${WORLD_IDENTIFIER}`);
  const status = `${data.data.message.players_current}/${data.data.message.players_maximum} (+${data.data.message.queue_current} | ${data.data.message.queue_wait_time_minutes} M)`;
  client.user.setPresence({
    activities: [
      {
        name: status,
        type: "WATCHING",
      },
    ],
    status: "online",
  });
};

client.once("ready", () => {
  console.log("New World Pop Bot Ready!");
  updateStatus().then();
  setInterval(updateStatus, REFRESH_RATE * 1000);
});

// Login to Discord with your client's token
client.login(BOT_TOKEN);
