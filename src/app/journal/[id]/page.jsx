import React from "react";
import { fetchBlogPost } from "@/utils/contentfulClient"; // Import your Contentful client function
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export default async function BlogDetails({ params }) {
  const { id } = params;
  const post = await fetchBlogPost(id);
  console.log(post);
  return (
    <main>
      <div className="journal-header">
        <Link href={"/journal"} className="back-link">
          <div className="arrow-cont">
            <svg
              className="arrow-back"
              width="60"
              height="60"
              viewBox="0 0 59 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.106443 30.0906L29.5449 0.651126L32.374 3.47925L7.76758 28.0867L58.9326 28.0398L58.9365 32.0398L7.75879 32.0857L32.3242 56.6511L29.4951 59.4793L0.106443 30.0906Z"
                fill="#141413"
              />
            </svg>
          </div>
          <h1>Journal</h1>
        </Link>
      </div>
      <div className="post-header">
        <div className="post-overlay"></div>
        <div className="post-img">
          <img
            src={post.fields.coverImage.fields.file.url}
            alt={post.fields.title}
          />
        </div>
        <div className="post-content">
          <h1>{post.fields.title}</h1>
          <div className="post-author">
            <div className="post-authorimg">
              <img
                src={post.fields.authorAvatar.fields.file.url}
                alt="author image"
              />
            </div>
            <div className="post-auth-bio">
              <h5>{post.fields.author}</h5>
              <p>{post.fields.authorRole}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="post-body"></div>
    </main>
  );
}
