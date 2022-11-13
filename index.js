const { Client, Intents } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES
  ]
});

let database = [];
database = require("./data.json");

client.on("ready",()=>{
  console.log(`ログイン:${client.user.tag}`);
  client.user.setActivity("学習中... | Training...",{
    type: "PLAYING"
  });
});

client.on("messageCreate",async(message)=>{
  console.log(`${message.author.tag}:${message.content}`)
  if(message.author.bot) return;
  let data = {
      "message": message.cleanContent,
      "channel": message.channelId,
      "guild": message.guildId,
      "time": message.createdAt,
      "IsReference": message.reference ? true : false,
      "ReferenceContent": message.reference ? (await message.fetchReference()).cleanContent : null,
      "ReferenceAuther": message.reference ? (await message.fetchReference()).author.id : null
  };
  database.push(data);
  fs.writeFileSync("data.json", JSON.stringify(database), "utf-8");
  delete require.cache[require.resolve("data.json")];
  console.log(data);
});

client.login(process.env.TOKEN);

process.on("uncaughtException",async(error) =>{
  console.error(`\x1b[31mERROR: ${error.stack}`);
});

process.on("unhandledRejection",async(error) =>{
  console.error(`\x1b[31mERROR: ${error.stack}`);
});