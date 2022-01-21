import "./styles.css";

import axios from "axios";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export default function Post({ id }) {
  const [post, setPost] = useState("Loading article..");

  const getPost = () => {
    axios
      .get(`https://paul.deta.dev/posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(getPost, []);

  return (
    <div className="Post">
      <h1> {post.name || "Loading..."}</h1>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}></div>
      <a className="btn" href={post.url}>visit original</a>
      <a className="btn" href="/">home</a>
    </div>
  );
}
