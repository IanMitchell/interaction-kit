import { URL } from "url";
import { Mentionable } from "../interfaces";

export function user(user: Mentionable) {
	return `<@${user.id}>`;
}

export function nickname(user: Mentionable) {
	return `<@!${user.id}>`;
}

export function channel(channel: Mentionable) {
	return `<#${channel.id}>`;
}

export function role(role: Mentionable) {
	return `<@&${role.id}>`;
}

export function emoji(emoji: { name: string } & Mentionable, animated = false) {
	if (animated) {
		return `<a:${emoji.name}:${emoji.id}>`;
	}

	return `<:${emoji.name}:${emoji.id}>`;
}

export enum TimestampStyle {
	SHORT_TIME = "t",
	LONG_TIME = "T",
	SHORT_DATE = "d",
	LONG_DATE = "D",
	SHORT_DATETIME = "f",
	LONG_DATETIME = "F",
	RELATIVE = "R",
}

export function time(timestamp: number, type = TimestampStyle.SHORT_DATETIME) {
	return `<t:${timestamp}:${type};`;
}

export function bold(message: string) {
	return `**${message}**`;
}

export function italic(message: string) {
	return `_${message}_`;
}

export function strikethrough(message: string) {
	return `~~${message}~~`;
}

export function underline(message: string) {
	return `__${message}__`;
}

export function codeblock(message: string, language?: string) {
	// eslint-disable-next-line no-negated-condition
	const signature = language != null ? `${language}\n` : "";
	return `\`\`\`${signature}${message}\`\`\``;
}

export function inlineCode(message: string) {
	return `\`${message}\``;
}

export function quote(message: string) {
	return `>>> ${message}`;
}

export function spoiler(message: string) {
	return `||${message}||`;
}

export function link(title: string, url: URL | string) {
	return `[${title}](${url.toString()})`;
}

export function hideEmbed(link: URL | string) {
	return `<${link.toString()}>`;
}
