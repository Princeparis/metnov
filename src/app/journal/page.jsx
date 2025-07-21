import BlogCard from "@/components/BlogCard";
import React from "react";

export default function Journal() {
  return (
    <div>
      <h1>Blog Posts</h1>
      <div>
        <BlogCard />
        <BlogCard />
        <BlogCard />
      </div>
    </div>
  );
}
