![Interaction Kit logo](./assets/logo-light.png#gh-dark-mode-only)
![Interaction Kit logo](./assets/logo-dark.png#gh-light-mode-only)

# Interaction Kit

> Our end strategy is being acquired by iCrawl

🚧 **INTERACTION KIT IS UNDER CONSTRUCTION AND IS NOT READY FOR USE** 🏗

Interaction Kit is a framework for creating Discord slash command bots over the HTTP API.

## HTTP vs Gateway

**TL;DR**: you probably should be using [discord.js](https://discord.js.org) unless you know why you're here.

There are two ways for bots to recieve events from Discord. Most API wrappers such as [discord.js](https://discord.js.org) use a WebSocket connection called a "Gateway" to receive events, but Interaction Kit receives Interaction events over HTTP. As such, there are some major points to keep in mind before deciding to use Interaction Kit.

### Gateway

The Gateway is a WebSocket that a bot maintains with Discord whenever it is online, giving it events as they happen. The bot is able to subscribe to a wide array of events through Gateway Intents, allowing it to be notified on events such as message sends, a member changing their nickname or a guild changing its icon.

This is the only way to receive the majority of events Discord provides, and when dealing with users or guilds you can generally be sure you are operating on current information with sufficient caching.

The main drawback of the Gateway is that it requires your bot to maintain a connection with Discord at all times. While there are affordable hosts for smaller scale bots, scaling can become expensive quickly and some developers have very low budgets.

### HTTP

HTTP-only bots are sent Interaction events through HTTP requests sent from Discord. These generally have a higher latency than a WebSocket connection from the same host and cannot listen for other types of event.

As a result of this, HTTP-only bots lack real time updates to members and guilds, so unless a bot utilizes REST API requests to get the latest data the chance that any cached data will be stale is significant.

On the other hand, they are much more scalable than Gateway-based bots, with a variety of "serverless" or "edge" plans on the market allowing HTTP-only bots to scale more easily and affordably than Gateway bots, with generous free plans that allow smaller bots to get off the ground without major infrastructure costs.

It needs to be emphasized that this approach does not work for all cases, as most real-time data can only be accessed through the Gateway - before making the decision to make a bot HTTP-only, care needs to be taken to ensure that Gateway features are not required.

<!--
TODO: Write

## Getting Started

## Community

## Packages -->

## Credits

Logo design by [Coding (@tandpfun)](https://github.com/tandpfun)
