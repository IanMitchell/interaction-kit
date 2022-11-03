import type {
	RESTGetAPIChannelMessageResult,
	RESTGetAPIChannelMessagesQuery,
	RESTGetAPIChannelMessagesResult,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult,
} from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { Snowflake } from "discord-snowflake";
import { client } from "../client.js";

/**
 * Returns an array of Messages for a Channel.
 * {@link https://discord.com/developers/docs/resources/channel#get-channel-messages | Discord Documentation}
 * @param channelId - The target Channel to get Messages in.
 * @returns An array of Messages
 */
export async function getMessages(
	channelId: Snowflake,
	params?: RESTGetAPIChannelMessagesQuery
) {
	const query = new URLSearchParams();

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			query.set(key, value);
		});
	}

	return client.get(Routes.channelMessages(channelId), {
		query,
	}) as Promise<RESTGetAPIChannelMessagesResult>;
}

/**
 * Get a Message.
 * {@link https://discord.com/developers/docs/resources/channel#get-channel-message | Discord Documentation}
 * @param channelId - The target Channel to get the Message in.
 * @param messageId - The target Message to get.
 * @returns The Message.
 */
export async function getMessage(channelId: Snowflake, messageId: Snowflake) {
	return client.get(
		Routes.channelMessage(channelId, messageId)
	) as Promise<RESTGetAPIChannelMessageResult>;
}

/**
 * Posts a Message to a Channel.
 * {@link https://discord.com/developers/docs/resources/channel#create-message | Discord Documentation}
 * @param channelId - The target Channel to post the Message in.
 * @param data - The Message content.
 * @returns The created Message.
 */
export async function createMessage(
	channelId: Snowflake,
	data: RESTPostAPIChannelMessageJSONBody
) {
	return client.post(Routes.channelMessages(channelId), {
		body: data,
	}) as Promise<RESTPostAPIChannelMessageResult>;
}
