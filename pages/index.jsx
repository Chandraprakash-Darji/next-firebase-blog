import { useState } from "react";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJson } from "../lib/firebase";

const LIMIT = 5;
export async function getServerSideProps(context) {
    const postQuery = firestore
        .collectionGroup("posts")
        .where("published", "==", true)
        .orderBy("createdAt", "desc")
        .limit(LIMIT);

    const posts = (await postQuery.get()).docs.map(postToJson);
    const end = posts.length < LIMIT;
    return {
        props: { posts ,end},
    };
}

export default function Home(props) {
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postEnd, setPostEnd] = useState(props.end);

    const getMorePosts = async () => {
        setLoading(true);
        const lastPost = posts[posts.length - 1];
        const cursor =
            typeof lastPost.createdAt === "number"
                ? fromMillis(lastPost.createdAt)
                : lastPost.createdAt;

        const postQuery = firestore
            .collectionGroup("posts")
            .where("published", "==", true)
            .orderBy("createdAt", "desc")
            .startAfter(cursor)
            .limit(LIMIT);

        const newPost = (await postQuery.get()).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPost));
        setLoading(false);

        if (newPost.length < LIMIT) {
            setPostEnd(true);
        }
    };

    return (
        <main>
            <PostFeed posts={posts} />

            {!loading && !postEnd && (
                <button onClick={getMorePosts}>Load More</button>
            )}

            {postEnd && "You have reached the end of the posts!!"}
        </main>
    );
}
