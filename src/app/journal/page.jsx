"use client";
import BlogCard from "@/components/BlogCard";
import React, { useState, useEffect } from "react";
import { client } from "@/utils/contentfulClient"; // Import your Contentful client
import Footer from "@/components/Footer";

export default function Journal() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await client.getEntries({
          content_type: "blog",
        }); // Replace with your content type
        setData(response.items); // Set fetched data to state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError(err); // Handle errors
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData(); // Call fetchData function
  }, []); // Empty dependency array ensures this runs only once

  console.log(data.fields);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <main className="journal-page">
        <div className="journal-header">
          <h1>Journal</h1>
        </div>
        <div className="journal-cont">
          {data && data.length > 0 ? (
            data.map((entry) => {
              return <BlogCard key={entry.sys.id} data={entry} />;
            })
          ) : (
            <p>No blog posts found.</p>
          )}
        </div>
      </main>
      <section className="scroll-help"></section>
      <Footer />
    </>
  );
}
