/**
 * title	256 characters
description	2048 characters
fields	Up to 25 field objects
field.name	256 characters
field.value	1024 characters
footer.text	2048 characters
author.name	256 characters

Additionally, the characters in all title, description, field.name, field.value, footer.text, and author.name fields must not exceed 6000 characters in total. Violating any of these constraints will result in a Bad Request response.
 */

type EmbedFooter = {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
};

type EmbedImage = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

type EmbedThumbnail = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

type EmbedVideo = {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
};

type EmbedProvider = {
	name?: string;
	url?: string;
};

type EmbedAuthor = {
	name?: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
};

type EmbedField = {
	name: string;
	value: string;
};

export class Embed {
	#title?: string;
	#description?: string;
	#url?: string;
	#timestamp?: Date;
	#color?: number;
	#footer?: EmbedFooter;
	#image?: EmbedImage;
	#thumbnail?: EmbedThumbnail;
	#video?: EmbedVideo;
	#provider?: EmbedProvider;
	#author?: EmbedAuthor;
	#fields?: EmbedField[];

	constructor() {}

	get title(): string | undefined {
		return this.#title;
	}

	set title(value: string | undefined) {
		// if (value?.length > 256) {
		//   throw new Error('Title must be less than 256 characters');
		// }

		this.#title = value;
	}

	serialize() {
		return {};
	}

	setTitle(value: string) {
		this.title = value;
	}

	private isValid() {
		// TODO: the characters in all title, description, field.name, field.value, footer.text, and author.name fields must not exceed 6000 characters in total. Violating any of these constraints will result in a Bad Request response.
	}
}

/**
 *
 *
 * title?	string	title of embed
type?	string	type of embed (always "rich" for webhook embeds)
description?	string	description of embed
url?	string	url of embed
timestamp?	ISO8601 timestamp	timestamp of embed content
color?	integer	color code of the embed
footer?	embed footer object	footer information
image?	embed image object	image information
thumbnail?	embed thumbnail object	thumbnail information
video?	embed video object	video information
provider?	embed provider object	provider information
author?	embed author object	author information
fields?	array of embed field objects	fields information

 */
