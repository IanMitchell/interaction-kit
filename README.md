# Interaction Kit

🚧 **INTERACTION KIT IS UNDER CONSTRUCTION AND IS NOT READY FOR USE** 🏗

Interaction Kit is a framework for creating Discord slash command bots over the HTTP API. TODO: More here.


## Getting Started

This library is currently in alpha 1 - it's very limited in what it can do and what is documented. 


If you would like to help out with the development, you can trial interaction-kit by creating a project that looks like this:

```
application/
├─ src/
│  ├─ commands/
│  │  ├─ ping.js
│  ├─ index.js
├─ .env
├─ package.json
```

The files should contain the following:

src/commands/ping.js:
```javascript
import { Command } from 'interaction-kit';

export default new Command({
  name: 'ping',
  description: 'Get a pong back',
  handler: (interaction) => {
    interaction.reply({ message: 'pong', ephemeral: true });
  },
});
```

src/index.js
```javascript
import { Application } from 'interaction-kit';
import PingCommand from './commands/ping.js';

export default new Application({
  applicationID: process.env.APPLICATION_ID,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
})
  .addCommand(PingCommand)
  .startServer();
```

package.json
```json
{
  "name": "interaction-kit-test",
  "version": "0.0.1",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node --es-module-specifier-resolution=node src/index.js"
  },
  "engines": {
    "node": ">=14"
  },
  "dependencies": {
    "interaction-kit": "^0.0.1"
  }
}
```

.env:
```
APPLICATION_ID=your_id
PUBLIC_KEY=your_key
TOKEN=your_token
DEVELOPMENT_SERVER_ID=your_dev_server
```

Steps:

1. Create a new Discord application and make it a bot user
2. Fill out the `.env` file
3. Add the bot to your server with https://discord.com/oauth2/authorize?client_id=APPLICATION_ID&scope=applications.commands (replace APPLICATION_ID with your application ID)
4. Install Cloudflared for Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

Then, run the following commands:

```
npm install
npm start
cloudflared tunnel --url http://localhost:3000
```

Copy the URL cloudflared gives you into your Interaction Endpoint. You should now be able to use your bot and the `/ping` command!
