import type {
	APIEmbed,
	APIEmbedAuthor,
	APIEmbedField,
	APIEmbedFooter,
	APIEmbedImage,
	APIEmbedThumbnail,
} from "discord-api-types/v10";

type FooterOptions = Omit<APIEmbedFooter, "icon_url" | "proxy_icon_url"> & {
	iconURL: APIEmbedFooter["icon_url"];
};

type AuthorOptions = Omit<APIEmbedAuthor, "icon_url" | "proxy_icon_url"> & {
	iconURL: APIEmbedAuthor["icon_url"];
};

type EmbedArgs = Omit<APIEmbed, "footer" | "author"> & {
	footer?: FooterOptions;
	author?: AuthorOptions;
};

export default class Embed {
	title: string | undefined;
	description: string | undefined;
	url: string | undefined;
	timestamp: string | undefined;
	color: number | undefined;
	footer: APIEmbedFooter | undefined;
	image: APIEmbedImage | undefined;
	thumbnail: APIEmbedThumbnail | undefined;
	author: APIEmbedAuthor | undefined;
	fields: APIEmbedField[] | undefined;

	constructor({
		title,
		description,
		url,
		timestamp,
		color,
		footer,
		image,
		thumbnail,
		author,
		fields,
	}: EmbedArgs = {}) {
		this.title = title;
		this.description = description;
		this.url = url;
		this.color = color;
		this.footer = footer;
		this.image = image;
		this.thumbnail = thumbnail;
		this.author = author;
		this.fields = fields;

		if (timestamp != null) {
			this.timestamp = new Date(timestamp).toISOString();
		}
	}

	setTitle(title: string) {
		this.title = title;
		return this;
	}

	setDescription(description: string) {
		this.description = description;
		return this;
	}

	setURL(url: string) {
		this.url = url;
		return this;
	}

	setTimestamp(timestamp: number | Date = Date.now()) {
		this.timestamp = new Date(timestamp).toISOString();
		return this;
	}

	setColor(color: number) {
		this.color = color;
		return this;
	}

	setFooter({ text, iconURL }: FooterOptions) {
		const footer: APIEmbedFooter = { text };

		if (iconURL != null) {
			footer.icon_url = iconURL;
		}

		this.footer = footer;
		return this;
	}

	setImage(url: string) {
		this.image = {
			url,
		};
		return this;
	}

	setThumbnail(url: string) {
		this.thumbnail = {
			url,
		};
		return this;
	}

	setAuthor({ name, url, iconURL }: AuthorOptions) {
		const author: APIEmbedAuthor = { name };

		if (url != null) {
			author.url = url;
		}

		if (iconURL != null) {
			author.icon_url = iconURL;
		}

		this.author = author;
		return this;
	}

	setFields(fields: APIEmbedField[]) {
		this.fields = fields;
		return this;
	}

	addField(field: APIEmbedField[]) {
		return this.setFields((this.fields ?? []).concat(field));
	}

	serialize(): APIEmbed {
		// @ts-expect-error it really wants me to do this as optional args
		return {
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image,
			thumbnail: this.thumbnail,
			author: this.author,
			fields: this.fields,
		};
	}
}
