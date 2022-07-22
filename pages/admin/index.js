import styles from '../../styles/Admin.module.css';
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimeStamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

const AdminPostPage = () => {
    return (
        <main>
            <AuthCheck>
                <PostList />
                <CreateNewPost />
            </AuthCheck>
        </main>
    );
};

export default AdminPostPage;

function PostList() {
    const ref = firestore
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("posts");

    const query = ref.orderBy("createdAt");
    const [querySnapshot] = useCollection(query);

    const post = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>manage your Posts</h1>
            <PostFeed posts={post} admin />
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState("");

    // Ensure slug is url safe
    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = firestore
            .collection("users")
            .doc(uid)
            .collection("posts")
            .doc(slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: "# hello world !!",
            createdAt: serverTimeStamp(),
            updatedAt: serverTimeStamp(),
            heartCount: 0,
        };

        await ref.set(data);

        toast.success("Post created successfully");

        router.push(`/admin/${slug}`);
    };

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article!"
                className={styles.input}
            />
            <p>
                <strong>Slug: </strong>
                {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}
