# Nextjs tips, tricks and best practices

## Use Layouts!

### Partial rendering

> Only the page components update

One benefit of using layouts in Next.js is that on navigation, only the page components update while the layout won't re-render. This is called partial rendering.

### Caveat: A root layout and is required

```ts
You can use the root layout to modify your <html> and <body> tags, and add metadata (you will learn more about metadata in a later chapter).
```

### Non-async promises can cause hydration errors

If you forgot to await for the promise that returns info you will use in your UI.
