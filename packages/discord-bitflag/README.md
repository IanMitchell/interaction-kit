# discord-bitflag

A JavaScript wrapper for Discord bitflags. You can easily modify Permissions, Intents, User flags, Channel Flags, and more with this library.

## Usage

Install the library by running

```
npm i discord-bitflag
```

Then import and use it in your code like this:

```js
import { PermissionFlags, PermissionsBitField } from "discord-bitflag";

const response = await fetch(DISCORD_API, { ...options });
const permissions = new PermissionsBitField(response.permissions);

if (permissions.has(PermissionFlags.BanMembers)) {
	console.log("This user can ban members!");
}

if (permissions.has(PermissionsBitField.ALL)) {
	console.log("This user has all permissions!");
}

if (permissions.hasWithoutAdmin(PermissionsBitField.ALL)) {
	console.log("This user REALLY has all permissions!");
}
```

## Permissions API

The Permissions BitField class checks for the Admin permission by default when you check a permission via the `.has()` method. If you would like to check to see if a permission is explicitly enabled without checking Admin, you can use the `.hasWithoutAdmin()` method instead.

## Bit Fields

Each bit field class extends the `BitField` class from [bitflag-js](https://www.npmjs.com/package/bitflag-js).

- [Application Flags](https://discord.com/developers/docs/resources/application#application-object-application-flags): `ApplicationFlagsBitField` and `ApplicationFlags`
- [Channel Flags](https://discord.com/developers/docs/resources/channel#channel-object-channel-flags): `ChannelFlagsBitField` and `ChannelFlags`
- [Guild Member Flags](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-flags): `GuildMemberFlagsBitField` and `GuildMemberFlags`
- [Intent Flags](https://discord.com/developers/docs/topics/gateway#list-of-intents): `IntentFlagsBitField` and `IntentFlags`
- [Message Flags](https://discord.com/developers/docs/resources/channel#message-object-message-flags): `MessageFlagsBitField` and `MessageFlags`
- [Permission Flags](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags): `PermissionsBitField` and `PermissionFlags`
- [User Flags](https://discord.com/developers/docs/resources/user#user-object-user-flags): `UserFlagsBitField` and `UserFlags`
