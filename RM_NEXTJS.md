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

## URL search params

benefits of implementing search with URL params:

- Bookmarkable and Shareable URLs: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.

- Server-Side Rendering and Initial Load: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.

- Analytics and Tracking: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.
