import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Copy from "@/components/Copy";
import Link from "next/link";

export default function BlogCard({ data }) {
  const blogImgRef = useRef(null);
  const contRef = useRef(null);
  const hoverTlRef = useRef(null);
  const { contextSafe } = useGSAP(() => {
    if (blogImgRef && contRef) {
      hoverTlRef.current = gsap
        .timeline({
          paused: true,
        })
        .to(blogImgRef.current, {
          scale: 1.1,
          duration: 0.5,
          ease: "ease.inOut",
        });
    }
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Get the day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Adds leading zero if day is < 10
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const handleMouseEnter = contextSafe(() => {
    if (hoverTlRef.current) {
      hoverTlRef.current.play();
    }
  });

  const handleMouseLeave = contextSafe(() => {
    // Renamed for clarity
    if (hoverTlRef.current) {
      hoverTlRef.current.reverse();
    }
  });
  return (
    <Link href={`/journal/${data.sys.id}`}>
      <div
        className="blog-card"
        ref={contRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="blog-img" ref={blogImgRef}>
          <img src={data.fields.coverImage.fields.file.url} alt="" />
        </div>
        <div className="content-overlay"></div>
        <div className="content">
          <Copy>
            <h1 className="title">{data.fields.title}</h1>
          </Copy>
          <div className="author">
            <div className="authorimg">
              <img
                src={data.fields.authorAvatar.fields.file.url}
                alt="author image"
              />
            </div>
            <div className="auth-bio">
              <h5>{data.fields.author}</h5>
              <p>{data.fields.authorRole}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
