import { describe, expect, test } from "vitest";
import {
	bold,
	channel,
	codeblock,
	emoji,
	hideEmbed,
	inlineCode,
	italic,
	link,
	nickname,
	quote,
	role,
	spoiler,
	strikethrough,
	time,
	TimestampStyle,
	underline,
	user,
} from "../markdown.js";

describe("Markdown Mentions", () => {
	test("user", () => {
		expect(user({ id: "123456789012345678" })).toBe(`<@123456789012345678>`);
	});
	test("nickname", () => {
		expect(nickname({ id: "123456789012345678" })).toBe(
			`<@!123456789012345678>`
		);
	});
	test("channel", () => {
		expect(channel({ id: "123456789012345678" })).toBe(`<#123456789012345678>`);
	});
	test("role", () => {
		expect(role({ id: "123456789012345678" })).toBe(`<@&123456789012345678>`);
	});
});

describe("Markdown Emoji", () => {
	test("static emoji", () => {
		expect(emoji({ name: "test", id: "123456789012345678" })).toBe(
			"<:test:123456789012345678>"
		);
	});
	test("animated emoji", () => {
		expect(emoji({ name: "test", id: "123456789012345678" }, true)).toBe(
			"<a:test:123456789012345678>"
		);
	});
});

describe("Markdown Formats", () => {
	test("timestamps", () => {
		const now = Date.now();
		expect(time(now)).toBe(`<t:${now}:f>`);
		expect(time(now, TimestampStyle.SHORT_TIME)).toBe(`<t:${now}:t>`);
		expect(time(now, TimestampStyle.LONG_TIME)).toBe(`<t:${now}:T>`);
		expect(time(now, TimestampStyle.SHORT_DATE)).toBe(`<t:${now}:d>`);
		expect(time(now, TimestampStyle.LONG_DATE)).toBe(`<t:${now}:D>`);
		expect(time(now, TimestampStyle.LONG_DATETIME)).toBe(`<t:${now}:F>`);
		expect(time(now, TimestampStyle.RELATIVE)).toBe(`<t:${now}:R>`);
	});
	test("bold", () => {
		expect(bold("message")).toBe("**message**");
	});
	test("italic", () => {
		expect(italic("message")).toBe("_message_");
	});
	test("strikethrough", () => {
		expect(strikethrough("message")).toBe("~~message~~");
	});
	test("underline", () => {
		expect(underline("message")).toBe("__message__");
	});
	test("codeblock", () => {
		expect(codeblock("message")).toBe("```message```");
	});
	test("codeblock with language", () => {
		expect(codeblock("message", "ts")).toBe("```ts\nmessage```");
	});
	test("inline code", () => {
		expect(inlineCode("message")).toBe("`message`");
	});
	test("quote", () => {
		expect(quote("message")).toBe(">>> message");
	});
	test("spoiler", () => {
		expect(spoiler("message")).toBe("||message||");
	});
	test("link", () => {
		expect(link("title", "https://interactionkit.dev")).toBe(
			"[title](https://interactionkit.dev)"
		);
	});
	test("hide embed", () => {
		expect(hideEmbed("https://interactionkit.dev")).toBe(
			"<https://interactionkit.dev>"
		);
	});
});
