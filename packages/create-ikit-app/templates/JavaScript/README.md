# {{name}}

This readme is a WIP. At a high level:

- You shouldn't need to modify app.js
- You shouldn't need to modify server.js
- Add new commands to `src/commands/`
- Add new components to `src/components`
- When responding with a component, import it from `src/components` and don't define it inline
  - Exception to the rule is for link buttons
- Custom javascript belongs in `src/lib`

In _theory_ you should be able to deploy this to Vercel.

## Commands

1. `npm run dev` -> runs a development server. Grab the ngrok URL and paste it into your Bot (don't use your prod bot for this)
2. `npm run deploy` -> updates all your global application commands. Run this as your build step in Vercel

bots
