/**
 * These type definitions come from the official Discord API docs. They should
 * be defined with references back to the documentation section.
 */

// https://discord.com/developers/docs/resources/channel#embed-object
export type Embed = {
	title?: string;
	type?: EmbedType;
	description?: string;
	url?: string;
	timestamp?: Date; // TODO: Verify this
	color?: number;
	footer?: EmbedFooter;
	image?: EmbedImage;
	thumbnail?: EmbedThumbnail;
	video?: EmbedVideo;
	provider?: EmbedProvider;
	author?: EmbedAuthor;
	fields?: EmbedField[];
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-types
export enum EmbedType {
	RICH,
	IMAGE,
	VIDEO,
	GIFV,
	ARTICLE,
	LINK,
}

// https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
export type EmbedThumbnail = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
export type EmbedVideo = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
export type EmbedImage = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
export type EmbedProvider = {
	name?: string;
	url?: string;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
export type EmbedAuthor = {
	name?: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
export type EmbedFooter = {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
};

// https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
export type EmbedField = {
	name: string;
	value: string;
	inline?: boolean;
};
