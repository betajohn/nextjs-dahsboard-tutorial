# Best Practices

## Typescript

### Use Nextjs' typescript plugin

```text
You can enable the plugin in VS Code by:

Opening the command palette (Ctrl/⌘ + Shift + P)
Searching for "TypeScript: Select TypeScript Version"
Selecting "Use Workspace Version"

if it doesn't show up in the menu, make sure you have a .ts file open.
```

### Prisma & sql

```Text
We're manually declaring the data types, but for better type-safety, we recommend Prisma, which automatically generates types based on your database schema.
Use prisma if using sql. Mongoose is better when using mongoDB
```

### where to store definitions?

A) store all in a definitions.ts file or B) define each type in the file where they are being used?

> Depends. No rule.

## Styling - Tailwind or CSS Modules

The two most used approaches in Nextjs development are Tailwind and CSS Modules.
You can use both!!

### How to use css Modules?

Create a css file with your styles, ideally in the same folder as the component you want to style, then inside that component import the css file.

```text
// moduleName.css
 .shape{
  background-color:red;
}

//component.tsx
import styles from './moduleName.css';


<div className={styles.shape} />;
```

### use clsx instead of template literals

> You can use clsx to conditionally apply classes.

toggling clases is easy!

```ts
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-sm',
        {
          'bg-gray-100 text-gray-500': status === 'pending',
          'bg-green-500 text-white': status === 'paid',
        },
      )}
    >
    // ...
)}
```

## Optimizing fonts and images

### Why optimize fonts? Fonts loading affects Cumulative Layout Shift

Custom fonts in your project can affect performance if the font files need to be fetched and loaded.

> Cumulative Layout Shift is a metric used by Google to evaluate the performance and user experience of a website

```text
 With fonts, layout shift happens when the browser initially renders text in a fallback or system font and then swaps it out for a custom font once it has loaded. This swap can cause the text size, spacing, or layout to change, shifting elements around it.
```

### use next/font module

Great for remote fonts such as Google fonts

```text
Next.js automatically optimizes fonts in the application when you use the next/font module. It downloads font files at build time and hosts them with your other static assets. This means when a user visits your application, there are no additional network requests for fonts which would impact performance.
```

> Good practice: Store all your fonts in a fonts.ts file

```ts
// fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });
```

```text
Then import your main font in your <body> inside layout.tsx

(You can also import secondary fonts in other components)
```

```ts
//layout.tsx
import { inter } from './fonts.ts';

<body className={`${inter.className} antialiased`}>{children}</body>

// Here, you're also adding the Tailwind antialiased class which smooths out the font. It's not necessary to use this class, but it adds a nice touch.

```

### Why optimize images?

With regular HTML, you would add an image as follows:

```ts
<img
  src="/hero.png"
  alt="Screenshots of the dashboard project showing desktop version"
/>
```

However, this means you have to manually:

- Ensure your image is responsive on different screen sizes.
- Specify image sizes for different devices.
- Prevent layout shift as the images load.
- azy load images that are outside the user's viewport.

> use next/image

Image Optimization is a large topic in web development that could be considered a specialization in itself. Instead of manually implementing these optimizations, you can use the next/image component to automatically optimize your images.

### the Image component

```ts
The <Image> Component is an extension of the HTML <img> tag, and comes with automatic image optimization, such as:
```

- Preventing layout shift automatically when images are loading.
- Resizing images to avoid shipping large images to devices with a smaller viewport.
- Lazy loading images by default (images load as they enter the viewport).
- Serving images in modern formats, like WebP and AVIF, when the browser supports it.

> It's good practice to set the width and height of your next/image s to avoid layout shift, these should be an aspect ratio identical to the source image.

## Optimizing navegation

Why optimize navigation?

```ts
To link between pages, you would traditionally use the <a> HTML element.

The problem is that the <a> HTML elements causes a full page refresh!
```

### use next/link instead

```ts
 <Link> allows you to do client-side navigation with JavaScript.

 <Link> extends <a> to provide prefetching and client-side navigation between routes.
```

### Automatic code-splitting and prefetching

To improve the navigation experience, Next.js automatically code splits your application by route segments. This is different from a traditional React SPA (single page application), where the browser loads all your application code on initial load.

> Splitting code by routes means that pages become isolated. If a certain page throws an error, the rest of the application will still work.

### Feels like a webapp

> Page transition near-instant!

Although parts of your application are rendered on the server, there's no full page refresh, making it feel like a web app.

Furthermore, in production, whenever <Link> components appear in the browser's viewport, Next.js automatically prefetches the code for the linked route in the background. By the time the user clicks the link, the code for the destination page will already be loaded in the background, and this is what makes the page transition near-instant!

#### Prefetching

> Prefetching is not enabled in development, only in production.

```text
Prefetching is a way to preload a route in the background before the user visits it.

<Link> component: Routes are automatically prefetched as they become visible in the user's viewport. Prefetching happens when the page first loads or when it comes into view through scrolling.

The <Link>'s default prefetching behavior (i.e. when the prefetch prop is left unspecified or set to null) is different depending on your usage of loading.js. Only the shared layout, down the rendered "tree" of components until the first loading.js file, is prefetched and cached for 30s. This reduces the cost of fetching an entire dynamic route, and it means you can show an instant loading state for better visual feedback to users.

- You can disable prefetching by setting the prefetch prop to false. Alternatively, you can prefetch the full page data beyond the loading boundaries by setting the prefetch prop to true.
- router.prefetch(): The useRouter hook can be used to prefetch routes programmatically.
```

Instant loading state (loading.ts)

> Create a loading state by adding a loading.js file inside a folder.

An instant loading state is fallback UI that is shown immediately upon navigation.

You can pre-render loading indicators such as skeletons and spinners, or a small but meaningful part of future screens such as a cover photo, title, etc. This helps users understand the app is responding and provides a better user experience.

```ts
//loading.tsx
// You can add any UI inside Loading, including a Skeleton.

export default function Loading() {
  return <LoadingSkeleton />;
}
```

```ts
// /dashboard/layout.tsx & /dashboard/loading.tsx go in the same folder
In the same folder, loading.tsx will be nested inside layout.js. It will automatically wrap the page.js file and any children below in a <Suspense> boundary.
```

Good to know:

- Navigation is immediate, even with server-centric routing.
- Navigation is interruptible, meaning changing routes does not need to wait for the content of the route to fully load before navigating to another route.
- Shared layouts remain interactive while new route segments load.

Recommendation: Use the loading.js convention for route segments (layouts and pages) as Next.js optimizes this functionality.
