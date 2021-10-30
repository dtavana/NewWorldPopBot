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

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

let currentStatus;

const updateStatus = async () => {
  const data = await apiClient.get(`/worlds/${WORLD_IDENTIFIER}`);
  currentStatus = `${data.data.message.players_current}/${data.data.message.players_maximum} (+${data.data.message.queue_current} | ${data.data.message.queue_wait_time_minutes} M)`;
  client.user.setPresence({
    activities: [
      {
        name: currentStatus,
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

client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() == "!pop" && !message.author.bot) {
    message.reply(`Current population status: \`${currentStatus}\``);
  }
});

client.login(BOT_TOKEN);
