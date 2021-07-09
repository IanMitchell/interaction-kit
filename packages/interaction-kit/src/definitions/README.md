# Discord API Definitions

The contents of these files comes straight from the API docs - they should be a direct match.

## Contributing & Style

TODO: Explain about typings and how to add references

## Usage

It's best to use these root definitions as much as possible, whether as a base type or by typing something with a field reference instead of the correlating type. As an illustration:

```typescript
// GOOD:
type CustomEmbedType = {
	title: EmbedDefinition["title"];
};

// BAD:
type CustomEmbedType = {
	title: string;
};
```

This helps ensure consistency with the API as it changes over time.
