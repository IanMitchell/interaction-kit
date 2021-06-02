/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

// TODO: Define these
type User = {};
type Guild = {};
type GuildMember = {};
type Role = {};
type Channel = {};
type Embed = {};

// https://discord.com/developers/docs/reference#api-reference-base-url
// https://discord.com/developers/docs/reference#api-versioning-api-versions
export const API_URL = 'https://discord.com/api/v9'

// https://discord.com/developers/docs/reference#snowflakes-snowflake-id-format-structure-left-to-right
export const EPOCH = 1420070400000;

// https://discord.com/developers/docs/reference#snowflakes
export type Snowflake = `${bigint}`;

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommand
export type ApplicationCommand = {
  id: Snowflake;
  application_id: Snowflake;
  name: string;
  description: string;
  options?: ApplicationCommandOption[];
  default_permission?: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption
export type ApplicationCommandOption = {
  type: ApplicationCommandOptionType;
  name: string;
  description: string;
  required?: boolean;
  choices?: ApplicationCommandOptionChoice[];
  options?: ApplicationCommandOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype
export enum ApplicationCommandOptionType {
  SUB_COMMAND = 1,
  SUB_COMMAND_GROUP = 2,
  STRING = 3,
  INTEGER = 4,
  BOOLEAN = 5,
  USER = 6,
  CHANNEL = 7,
  ROLE = 8,
  MENTIONABLE = 9
}

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptionchoice
export type ApplicationCommandOptionChoice = {
  name: string;
  value: string | number;
};

// https://discord.com/developers/docs/interactions/slash-commands#guildapplicationcommandpermissions
export type GuildApplicationCommandPermissions = {
  id: Snowflake;
  application_id: Snowflake;
  guild_id: Snowflake;
  permissions: ApplicationCommandPermissions[];
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissions
export type ApplicationCommandPermissions = {
  id: Snowflake;
  type: ApplicationCommandPermissionType;
  permission: boolean;
};

// https://discord.com/developers/docs/interactions/slash-commands#applicationcommandpermissiontype
export enum ApplicationCommandPermissionType {
  ROLE = 1,
  USER = 2
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction
export type Interaction = {
  id: Snowflake;
  application_id: Snowflake;
  type: InteractionType;
  data?: ApplicationCommandInteractionData;
  guild_id?: Snowflake;
  channel_id?: Snowflake;
  member?: GuildMember;
  user?: User;
  token: string;
  version: number;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-interactiontype
export enum InteractionType {
  PING = 1,
  APPLICATION_COMMAND = 2
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondata
export type ApplicationCommandInteractionData = {
  id: Snowflake;
  name: string;
  resolved?: ApplicationCommandInteractionDataResolved;
  options?: ApplicationCommandInteractionDataOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataresolved
export type ApplicationCommandInteractionDataResolved = {
  users?: { [key: Snowflake]: User };
  members?: { [key: Snowflake]: Omit<GuildMember, "user" | "deaf" | "mute"> };
  roles?: { [key: Snowflake]: Role };
  channels?: {
    [key: Snowflake]: Pick<Channel, "id" | "name" | "type" | "permissions">;
  };
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption
// TODO: Mutually exclusive, also what is option type?
export type ApplicationCommandInteractionDataOption = {
  name: string;
  type: ApplicationCommandOptionType;
  value?: OptionType;
  options?: ApplicationCommandInteractionDataOption[];
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response
// TODO: Check?
export type InteractionResponse = {
  type: InteractionCallbackType;
  data?: InteractionApplicationCommandCallbackData;
};

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactioncallbacktype
export enum InteractionCallbackType {
  PONG = 1,
  CHANNEL_MESSAGE_WITH_SOURCE = 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5
}

// https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionapplicationcommandcallbackdata
export type InteractionApplicationCommandCallbackData = {
  tts?: boolean;
  content?: string;
  embeds?: Embed[];
  allowed_mentions?: AllowedMentions;
  flags?: number;
};

// https://discord.com/developers/docs/interactions/slash-commands#messageinteraction
export type MessageInteraction = {
  id: Snowflake;
  type: InteractionType;
  name: string;
  user: User;
};

// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
export enum AllowedMentionTypes {
  ROLE = "roles",
  USER = "users",
  EVERYONE = "everyone"
}

// https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure
export type AllowedMentions = {
  parse: AllowedMentionTypes[];
  roles: Snowflake[];
  users: Snowflake[];
  replied_user: boolean;
};

// https://discord.com/developers/docs/interactions/message-components#component-object
// TODO: Add in type constraints
export type Component = {
  type: ComponentType; // all
  style?: ButtonStyle; // button
  label?: string;      // button
  emoji?: Pick<Emoji, "id" | "name" | "animated">;        // button
  custom_id?: string;  // button
  url?: string;        // button
  disabled?: boolean;  // button
  components?: Component[] // action rows
}

// https://discord.com/developers/docs/interactions/message-components#component-types
export enum ComponentType {
  ACTION_ROW = 1,
  BUTTON = 2,
  SELECT = 3
}

// https://discord.com/developers/docs/interactions/message-components#buttons-button-styles
export enum ButtonStyle {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  LINK = 5,
}

// https://discord.com/developers/docs/resources/emoji#emoji-object-emoji-structure
// TODO: add in type constraints
export type Emoji = {
  id: Snowflake | null;
  name: string | null;
  roles?: Snowflake[];
  user?: User;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}
