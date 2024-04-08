# Best Practices - Part 2

## route handlers

```text
In nextjs14, Route Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs.
Route Handlers are only available inside the app directory. They are the equivalent of API Routes inside the pages directory.

Route Handlers are defined in a route.js|ts file inside the app directory:
```

### NextRequest and NextResponse

```text
NextRequest and NextResponse extend native Request and Response APIs
```

### Get request when visiting a website

```text
When you enter a website's address into your web browser's address bar and hit enter (e.g., typing "google.com" and pressing enter), your browser sends a GET request to the server where the website is hosted.
```

## Fetching Data

### Choosing how to fetch data

```text
- API layer
APIs are an intermediary layer between your application code and database. There are a few cases where you might use an API:
 * If you're using 3rd party services that provide an API.
 * If you're fetching data from the client, you want to have an API layer that runs on the server to avoid exposing your database secrets to the client.
 [In Next.js, you can create API endpoints using Route Handlers.]
```

```text
-Database queries
When you're creating a full-stack application, you'll also need to write logic to interact with your database. For relational databases like Postgres, you can do this with SQL, or an ORM like Prisma.

There are a few cases where you have to write database queries:

When creating your API endpoints, you need to write logic to interact with your database.
If you are using React Server Components (fetching data on the server), you can skip the API layer, and query your database directly without risking exposing your database secrets to the client.
```

### Using Server Components to fetch data

- Server Components support promises, providing a simpler solution for asynchronous tasks like data fetching. You can use async/await syntax without reaching out for useEffect, useState or data fetching libraries.
- Server Components execute on the server, so you can keep expensive data fetches and logic on the server and only send the result to the client.
- As mentioned before, since Server Components execute on the server, you can query the database directly without an additional API layer.

## Databse Queries and other network requests

### Request waterfall

```text
When using promise.all() The data requests are unintentionally blocking each other, creating a request waterfall.
By default, Next.js prerenders routes to improve performance, this is called Static Rendering. So if your data changes, it won't be reflected in your dashboard.

What are request waterfalls?
A "waterfall" refers to a sequence of network requests that depend on the completion of previous requests. In the case of data fetching, each request can only begin once the previous request has returned data.

This pattern is not necessarily bad. There may be cases where you want waterfalls because you want a condition to be satisfied before you make the next request. For example, you might want to fetch a user's ID and profile information first. Once you have the ID, you might then proceed to fetch their list of friends. In this case, each request is contingent on the data returned from the previous request.

However, this behavior can also be unintentional and impact performance.
```

### Parallel data fetching

```text
A common way to avoid waterfalls is to initiate all data requests at the same time - in parallel.

In JavaScript, you can use the Promise.all() or Promise.allSettled() functions to initiate all promises at the same time.

By using this pattern, you can:
Start executing all data fetches at the same time, which can lead to performance gains.
Use a native JavaScript pattern that can be applied to any library or framework.

However, there is one disadvantage of relying only on this JavaScript pattern: what happens if one data request is slower than all the others?
```

## Static and Dynamic Rendering

```text
The dashboard is static, so any data updates will not be reflected on your application.
```

### What is Static Rendering?

```text
With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or during revalidation. The result can then be distributed and cached in a Content Delivery Network (CDN).

Whenever a user visits your application, the cached result is served. There are a couple of benefits of static rendering:

Faster Websites - Prerendered content can be cached and globally distributed. This ensures that users around the world can access your website's content more quickly and reliably.
Reduced Server Load - Because the content is cached, your server does not have to dynamically generate content for each user request.
SEO - Prerendered content is easier for search engine crawlers to index, as the content is already available when the page loads. This can lead to improved search engine rankings.
Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data that is regularly updated.

The opposite of static rendering is dynamic rendering.
```

## What is Dynamic Rendering?

```text
With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:

Real-Time Data - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
User-Specific Content - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
Request Time Information - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.
```

### Making components and functions dynamic

```text
You can use a Next.js API called unstable_noStore inside your Server Components or data fetching functions to opt out of static rendering.

import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  // ...
}
```

> your whole page is blocked while the data is being fetched.
> Which brings us to a common challenge developers have to solve:
> With dynamic rendering, your application is only as fast as your slowest data fetch.

## Streaming

### What is streaming?

```text
Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.

By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.
```

> Streaming works well with React's component model, as each component can be considered a chunk.

```text
There are two ways you implement streaming in Next.js:

At the page level, with the loading.tsx file.
For specific components, with <Suspense>.
```

### loading.tsx

```text
-loading.tsx is a special Next.js file built on top of Suspense, it allows you to create fallback UI to show as a replacement while page content loads.

-Since <SideNav> is static, it's shown immediately. The user can interact with <SideNav> while the dynamic content is loading.

-The user doesn't have to wait for the page to finish loading before navigating away (this is called interruptable navigation).

```

### Adding loading skeletons

```text
A loading skeleton is a simplified version of the UI. Many websites use them as a placeholder (or fallback) to indicate to users that the content is loading. Any UI you embed into loading.tsx will be embedded as part of the static file, and sent first. Then, the rest of the dynamic content will be streamed from the server to the client.
```

### Streaming a component

```text
You can be more granular and stream specific components using React <Suspense>.

Suspense allows you to defer rendering parts of your application until some condition is met (e.g. data is loaded). You can wrap your dynamic components in Suspense. Then, pass it a fallback component to show while the dynamic component loads.
```

### Deciding where to place your Suspense boundaries

```text
It's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.
```

> Currently, if you call a dynamic function inside your route (e.g. noStore(), cookies(), etc), your entire route becomes dynamic.

### Why use URL search params?

```text
-Bookmarkable and Shareable URLs: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.

-Server-Side Rendering and Initial Load: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.

-Analytics and Tracking: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.
```

### defaultValue vs. value / Controlled vs. Uncontrolled (input props)

```text
If you're using state to manage the value of an input, you'd use the value attribute to make it a controlled component. This means React would manage the input's state.

However, since you're not using state, you can use defaultValue. This means the native input will manage its own state. This is okay since you're saving the search query to the URL instead of state.
```

### searchParams

```text
Page components accept a prop called searchParams, so you can pass the current URL params to the <Table> component.

When to use the useSearchParams() hook vs. the searchParams prop?

You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

<Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
<Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.
As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.
```

### Debouncing

```text
Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.

How Debouncing Works:

1-.Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
2-.Wait: If a new event occurs before the timer expires, the timer is reset.
3.-Execution: If the timer reaches the end of its countdown, the debounced function is executed.

You can implement debouncing in a few ways, including manually creating your own debounce function. To keep things simple, we'll use a library called use-debounce.

npm i use-debounce

By debouncing, you can reduce the number of requests sent to your database, thus saving resources.
```
