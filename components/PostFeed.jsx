import Link from "next/link";
import React from "react";

const PostFeed = ({ posts, admin }) => {
    return posts
        ? posts.map((post) => (
              <PostItem post={post} admin={admin} key={post.slug} />
          ))
        : null;
};

export default PostFeed;

function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/s+/g).length;
    const minuteToRead = (wordCount / 100 + 1).toFixed(0);
    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <a>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>
            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    <a>{post.title}</a>
                </h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minuteToRead} min read
                </span>
                <span className="push-left">💗 {post.heartCount} Hearts</span>
            </footer>
        </div>
    );
}
