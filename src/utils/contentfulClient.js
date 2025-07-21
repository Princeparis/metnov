import { createClient } from "contentful";

// Create Contentful client
export const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchBlogPost(id) {
  const entries = await client.getEntries({
    content_type: "blog",
    "sys.id": id,
    limit: 1,
  });
  return entries.items.length > 0 ? entries.items[0] : null;
}
