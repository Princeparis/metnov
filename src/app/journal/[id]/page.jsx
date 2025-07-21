import React from "react";
import { fetchBlogPost } from "@/utils/contentfulClient"; // Import your Contentful client function

export default async function BlogDetails({ params }) {
  const { id } = params;
  const post = await fetchBlogPost(id);
  console.log(post);
  return (
    <main>
      <div className="header">
        <div className="post-img">
          <img
            src={post.fields.coverImage.fields.file.url}
            alt={post.fields.title}
          />
        </div>
      </div>
    </main>
  );
}
