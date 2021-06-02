import {JSONAble} from '../interfaces';

class InvalidEmbedFieldLength extends Error {
	constructor(property: string, length: number) {
		super(`An embed's ${property} length must not exceed ${length}.`);
	}
}

export class Embed implements JSONAble {
	readonly #data: {
		title: string | null;
		description: string | null;
		url: string | null;
		timestamp: Date | null;
		color: number | null;
		footer: EmbedFooter | null;
		image: EmbedImage | null;
		thumbnail: EmbedThumbnail | null;
		video: EmbedVideo | null;
		provider: EmbedProvider | null;
		author: EmbedAuthor | null;
		fields: EmbedField[];
	} = {
		title: null,
		author: null,
		color: null,
		footer: null,
		image: null,
		provider: null,
		thumbnail: null,
		timestamp: null,
		video: null,
		description: null,
		url: null,
		fields: [],
	};

	setAuthor(author: EmbedAuthor) {
		if (author.name && author.name.length > 256) {
			throw new InvalidEmbedFieldLength('author name', 256);
		}

		this.#data.author = author;

		return this;
	}

	setFooter(footer: EmbedFooter) {
		if (footer.text.length > 2048) {
			throw new InvalidEmbedFieldLength('footer text', 2048);
		}

		this.#data.footer = footer;

		return this;
	}

	addField(field: EmbedField) {
		if (this.#data.fields.length === 25) {
			throw new Error(
				'You can only have a maximum of 25 fields on a single embed.'
			);
		}

		if (field.name.length > 256) {
			throw new InvalidEmbedFieldLength('field.name', 256);
		}

		if (field.value.length > 1024) {
			throw new InvalidEmbedFieldLength('field.value', 1024);
		}

		this.#data.fields.push(field);

		return this;
	}

	addFields(...fields: EmbedField[]) {
		if (this.#data.fields.length === 25) {
			throw new Error(
				'You can only have a maximum of 25 fields on a single embed.'
			);
		}

		for (const field of fields) {
			this.addField(field);
		}

		return this;
	}

	setTitle(title: string) {
		if (title.length > 256) {
			throw new InvalidEmbedFieldLength('title', 256);
		}

		this.#data.title = title;

		return this;
	}

	setDescription(description: string) {
		if (description.length > 2048) {
			throw new InvalidEmbedFieldLength('description', 2048);
		}

		this.#data.description = description;

		return this;
	}

	get title() {
		return this.#data.title;
	}

	get url() {
		return this.#data.url;
	}

	get fields() {
		return this.#data.fields;
	}

	get author() {
		return this.#data.author;
	}

	get color() {
		return this.#data.color;
	}

	get footer() {
		return this.#data.footer;
	}

	get timestamp() {
		return this.#data.timestamp;
	}

	get video() {
		return this.#data.video;
	}

	get description() {
		return this.#data.description;
	}

	get image() {
		return this.#data.image;
	}

	get thumbnail() {
		return this.#data.thumbnail;
	}

	get provider() {
		return this.#data.provider;
	}

	toJSON() {
		return this.#data;
	}

	isValid() {
		// TODO: the characters in all title, description, field.name, field.value, footer.text, and author.name fields must not exceed 6000 characters in total. Violating any of these constraints will result in a Bad Request response.
	}
}

interface EmbedFooter {
	text: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

interface EmbedImage {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

interface EmbedThumbnail {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

interface EmbedVideo {
	url?: string;
	proxy_url?: string;
	height?: number;
	width?: number;
}

interface EmbedProvider {
	name?: string;
	url?: string;
}

interface EmbedAuthor {
	name?: string;
	url?: string;
	icon_url?: string;
	proxy_icon_url?: string;
}

interface EmbedField {
	name: string;
	value: string;
	inline: boolean;
}

/*
Fields
title?	string	title of embed
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
