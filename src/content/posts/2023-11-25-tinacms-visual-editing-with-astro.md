---
title: Using Tina's Visual Editing with an Astro Site
date: 2023-11-25
tags:
  - Astro
  - TinaCMS
  - Headless CMS
  - Visual Editing
---

I've used TinaCMS on my last two Astro projects and overall I've been quite 
happy with it, so I wanted to write up a 

I have spent some time searching for a good and cheap (aka git-based) headless 
CMS for static web projects. Since Netlify CMS was dead [until 
recently](https://www.netlify.com/blog/netlify-cms-to-become-decap-cms/), I 
decided to give TinaCMS a try for my past two Astro projects. I've been quite 
happy with it overall, and a large part of the appeal for me is the [visual (or 
"contextual") editor](https://tina.io/docs/contextual-editing/overview/). So 
I'm writing this partly as a guide for setting up Tina's visual editor on an 
Astro site, and partly to document some "gotchas" that I ran into along the 
way.

<!-- alt -->

If you'd like to skip most of this, you can check out the repos for the basic 
[demo](https://github.com/dawaltconley/tina-astro) I made, or [Soraya's 
website](https://github.com/dawaltconley/soraya-palmer/), which was the 
inspiration for this post. But I'll add some things here and also document some 
of the "gotchas" I ran into along the way.

Required:
  - `tinacms` v1.5.17 or greater
  - `astro` v2.6.0 or greater
  - a compatible version of `@astrojs/react`

## Quick setup

```sh
npm create astro@latest
# cd into project directory
npx @tinacms/cli@latest init
```

## Why?

TinaCMS works with basically any static-site generator, but its visual editor 
is only officially supported with Next.js. You certainly _can_ play it safe and 
stick with the basic editor, but you'd be missing out. (This is not a 
comparison post but I do think Netlify CMS's basic editor had more features 
last I used it, so you might want to look at Decap if visual editing is not a 
concern.) Visual editing is one of the best features Tina has to offer, and 
it's fairly hard to come by with headless CMSs. In my experience, clients don't 
expect this to be a hard problem. They played with WordPress years ago and 
expect to be able to see what their site will look like as they type. A good 
visual editor definitely helps when convincing clients to use something else.

<!--
Netlify CMS (using multiple branches for previews...what is this called) 

Now, with Astro and TinaCMS, it's possible to achieve a totally static and 
near-zero JavaScript website which "springs to life" in CMS to allow visual 
editing and high-fidelity live previews of changes before the user commits.
-->

## How?

As noted in the official [Astro setup 
guide](https://tina.io/docs/frameworks/astro/), Tina has "experimental" support 
for visual editing on Astro sites. This is our starting point. Basically, 
visual editing seems to "just work" under a few conditions:

1. You are using [data fetching](https://tina.io/docs/features/data-fetching/) 
   to load content into your site. (This means that your markdown goes in 
   Tina's content directory and _not_ Astro's.)
2. You pass that content (the _whole_ client response) to the `useTina` hook in 
   a React component.
3. That React component hydrates (at some point) in Tina's visual editor.

This means that basic visual editing can be achieved with the following setup
(cribbed mostly from Jeff See's 
[demo](https://github.com/jeffsee55/tina-astro/tree/main)):

<!-- this is probably too much, most of this is documented already... -->

```markdown
---
# tina/content/posts/test.md
title: Test Post
---

Test body content.
```

```typescript
// tina/config.ts
import { defineStaticConfig } from 'tinacms';

export default defineStaticConfig({
  /* ... */
  schema: {
    collections: [
      {
        name: 'posts',
        label: 'Posts',
        path: 'content/posts',
        fields: [
          {
            type: 'string',
            name: 'title',
            label: 'Title',
            required: true,
            isTitle: true,
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
});
```

```astro
---
// src/pages/test.astro
import { client } from '../../tina/__generated__/client'
import Post from '../components/Post.jsx'
const response = await client.queries.posts({ relativePath: 'test.md' });
---

<Post client:load clientResponse={response} />
```

```jsx
// src/components/Post.jsx
import { useTina } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text'

export default function Post({ clientResponse }) {
  const { data } = useTina(clientResponse);
  const { title, body } = data.posts

  return (
    <div>
      <h1>{title}</h1>
      <TinaMarkdown content={body} />
    </div>
  );
};
```

That's enough to get visual editing working. But the `client:load` directive 
means that this Post component will be hydrated on page load, even though, in 
the case of blog posts, there's probably no good reason for this. Are we really 
going to send `react-dom` to the client just to improve the content authoring 
experience?

***No!***

We can avoid this by using a custom client directive.

### Only hydrating components in the Tina editor

To me, the Jamstack dream is a near-zero JavaScript website that "springs to 
life" in a headless CMS to allow visual editing and high-fidelity live previews 
of changes before the author commits. Since Astro introduced [custom client 
directives](https://docs.astro.build/en/reference/directives-reference/#custom-client-directives) 
in v2.6, this is now possible.

I'll walk through how this works, but if you just want to get started with it, 
I published a tiny [astro 
integration](https://www.npmjs.com/package/astro-tina) to NPM, which adds a 
`client:tina` directive that hydrates React components in Tina's visual editor.

...

## Pain points

I'm going to limit my gripes here to issues that _specifically_ arise from 
using TinaCMS with Astro, and leave the rest to their respective GitHub issues.

### Boilerplate

You may find, especially if you're using TypeScript, that you end up writing a 
lot of the same code to pass data from Tina to your React islands.

```tsx
import type { SomeQuery } from '@tina/__generated__/types'
import { useTina } from 'tinacms/dist/react'
/* ... */

interface ComponentProps {
  data: Parameters<typeof useTina<SomeQuery>>[0]
  /* any other non-tina props */
}

export default function Component({ data }: ComponentProps) {
  const { data } = useTina<SomeQuery>(site)
  /* ... */
}
```

This is not unmanageable as far as boilerplate goes, but I chose to abstract it 
with a higher-order component that could wrap any React component to make it 
Tina-editable:

```tsx
import type { FunctionComponent } from 'react'
import { useTina } from 'tinacms/dist/react'

export type TinaData<T extends object = object> = Parameters<
  typeof useTina<T>
>[0]

export function withTinaWrapper<
  Query extends object,
  Props extends object = {},
>(
  Child: FunctionComponent<
    Omit<Props, 'data'> & ReturnType<typeof useTina<Query>>
  >,
): FunctionComponent<Props & { data: TinaData<Query> }> {
  return ({ data, ...props }) => <Child {...props} {...useTina(data)} />
}
```

That's pretty ugly! But it allows you to write the above component like this:

```tsx
import type { SomeQuery } from '@tina/__generated__/types'
import { withTinaWrapper } from './withTinaWrapper'
/* ... */

interface ComponentProps {
  /* any non-tina props */
}

export default withTinaWrapper<SomeQuery, ComponentProps>(
  ({ data }) => {
    /* ... */
  }
)
```

### Bloat

Wrapper bloat when passing serializing Tina queries in multiple `astro-island` 
components.

Much of this can be handled by gzip; still an unfortunate cost when the client 
gets no benefit from the size increase, except for the benefit of not having to 
hydrate an entire page.

Results of testing:

`index.html` with the same `page` data serialized in 5 separate islands:
  - uncompressed: 176K
  - compressed: 23,107 bytes

Adding a 6th serialized `page` query (in place of a more-concise custom query 
that pulls only the fields it needs):
  - uncompressed: 200K
  - compressed: 23,795 bytes

That's a 13.6% increase in uncompressed file size, but only a 3% increase in 
gzipped file size.

Results adding a serialized attribute on a smaller page:
  - uncompressed: 88K -> 104K
  - compressed: 14,689 -> 14,958 bytes

If this is a concern, the bloat can be reduced by using a [custom GraphQL 
query](https://tina.io/docs/data-fetching/custom-queries/) for each component 
you want to hydrate. My advice is to start by using Tina's built-in queries and 
then do some testing to see how much bandwidth custom queries would save you.

### Asynchronous hydration can create race-conditions

This is probably the most serious obstacle to implementing visual editing using 
Tina CMS with Astro. 
