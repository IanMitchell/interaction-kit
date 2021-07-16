import type {
	Embed as EmbedDefinition,
	EmbedAuthor,
	EmbedField,
	EmbedFooter,
	EmbedImage,
	EmbedProvider,
	EmbedThumbnail,
	EmbedVideo,
} from "../definitions";
import type { Serializable } from "../interfaces";

export default class Embed implements Serializable {
	public title: EmbedDefinition["title"];
	public description: EmbedDefinition["description"];
	public url: EmbedDefinition["url"];
	public timestamp: EmbedDefinition["timestamp"];
	public color: EmbedDefinition["color"];
	public footer: EmbedFooter | undefined;
	public image: EmbedImage | undefined;
	public thumbnail: EmbedThumbnail | undefined;
	public video: EmbedVideo | undefined;
	public provider: EmbedProvider | undefined;
	public author: EmbedAuthor | undefined;
	public fields: EmbedField[];

	constructor(options?: EmbedDefinition) {
		// TODO: Add validations for API limits
		this.title = options?.title;
		this.description = options?.description;
		this.url = options?.url;
		this.timestamp = options?.timestamp;
		this.color = options?.color;
		this.footer = options?.footer;
		this.image = options?.image;
		this.thumbnail = options?.thumbnail;
		this.video = options?.video;
		this.provider = options?.provider;
		this.author = options?.author;
		this.fields = options?.fields ?? [];
	}

	// TODO: Validate
	setTitle(title: EmbedDefinition["title"]) {
		this.title = title;
		return this;
	}

	// TODO: Validate
	setDescription(description: EmbedDefinition["description"]) {
		this.description = description;
		return this;
	}

	// TODO: Validate
	setURL(url: EmbedDefinition["url"]) {
		this.url = url;
		return this;
	}

	// TODO: Validate
	setTimestamp(timestamp: EmbedDefinition["timestamp"]) {
		this.timestamp = timestamp;
		return this;
	}

	// TODO: Expand this to allow for hex or other colors, and automatically translate them
	// TODO: Validate
	setColor(color: EmbedDefinition["color"]) {
		this.color = color;
		return this;
	}

	// TODO: Validate
	setFooter(footer: EmbedFooter) {
		this.footer = footer;
		return this;
	}

	// TODO: Validate
	setImage(image: EmbedImage) {
		this.image = image;
		return this;
	}

	// TODO: Validate
	setThumbnail(thumbnail: EmbedThumbnail) {
		this.thumbnail = thumbnail;
		return this;
	}

	// TODO: Validate
	setProvider(provider: EmbedProvider) {
		this.provider = provider;
		return this;
	}

	// TODO: Validate
	setAuthor(author: EmbedAuthor) {
		this.author = author;
		return this;
	}

	// TODO: Validate
	addField(field: EmbedField) {
		this.fields.push(field);
		return this;
	}

	serialize(): EmbedDefinition {
		return {
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			footer: this.footer,
			image: this.image,
			thumbnail: this.thumbnail,
			video: this.video,
			provider: this.provider,
			author: this.author,
			fields: this.fields,
		};
	}
}
