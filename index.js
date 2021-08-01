const Discord = require('discord.js');
const fs = require('fs').promises;

const client = new Discord.Client();

const modules = {};
const context = {};

client.on('ready', () => {
    console.log('ready...');
});

client.on('message', message => {
    if (message.author.bot || message.mentions.has(client.user) === false) {
        return;
    }

    const content = message.content;
    const commands = content.split(/\s+/);
    
    const module = modules[commands[1]];
    if(module === undefined) {
        message.reply('not found command.').catch(console.error);
        return;
    }
    module(message, client, commands);
});

const init = async() => {
    const token = await fs.readFile("./token", 'utf8');
    const directories = await fs.readdir("./modules");

    for(let i=0; i<directories.length; i++) {
        const key = directories[i];
        modules[key] = await require(".\\modules\\" + key + "\\index.js")(context);
    }

    client.login(token);
};

init();