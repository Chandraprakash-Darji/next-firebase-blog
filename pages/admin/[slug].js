import styles from "../../styles/Admin.module.css";
import React, { useState } from "react";
import AuthCheck from "../../components/AuthCheck";
import { useRouter } from "next/router";
import { auth, firestore, serverTimeStamp } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ImageUploder from "../../components/ImageUploder";

const AdminPostEdit = () => {
    return (
        <AuthCheck>
            <PostManger />
        </AuthCheck>
    );
};

export default AdminPostEdit;

function PostManger() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = firestore
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("posts")
        .doc(slug);

    const [post] = useDocumentData(postRef);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm
                            postRef={postRef}
                            defaultValues={post}
                            preview={preview}
                        />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>
                            {preview ? "Edit" : "Preview"}
                        </button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button>Live View</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, reset, watch, formState } = useForm({
        defaultValues,
        mode: "onChange",
    });

    const { isValid, isDirty, errors } = formState;

    const updatePost = async ({ content, published }) => {
        await postRef.update({
            content,
            published,
            updatedAt: serverTimeStamp(),
        });

        reset({ content, published });

        toast.success("Post updated successfully!");
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch("content")}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploder />

                <textarea
                    {...register("content", {
                        required: {
                            value: true,
                            message: "Content is required",
                        },
                        maxLength: {
                            value: 20000,
                            message: "Content Max 20000 characters",
                        },
                        minLength: {
                            value: 10,
                            message: "Content Min 10 characters",
                        },
                    })}
                ></textarea>
                {errors.content && (
                    <p className="text-danger">{errors.content.message}</p>
                )}
                <fieldset>
                    <input
                        className={styles.checkbox}
                        type="checkbox"
                        id="publishedToggle"
                        {...register("published", { required: false })}
                    />
                    <label htmlFor="publishedToggle">Published</label>
                </fieldset>

                <button
                    type="submit"
                    className="btn-green"
                    disabled={!isValid || !isDirty}
                >
                    Save Changes
                </button>
            </div>
        </form>
    );
}
