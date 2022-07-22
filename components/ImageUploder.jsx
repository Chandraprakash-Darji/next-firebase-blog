import React, { useState } from "react";
import { auth, STATE_CHANGED, storage } from "../lib/firebase";
import Loader from "./Loader";
const ImageUploder = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dowloadURL, setDowloadURL] = useState(null);

    const uploadFile = async (e) => {
        // get a file
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split("/")[1];

        // Make reference to the storage bucket loaction
        const ref = storage.ref(
            `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
        );
        setUploading(true)
        // Start the upload
        const task = ref.put(file);

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
            ).toFixed(0);
            setProgress(pct);
            // Get Download URL after task resolves ( Not native promise)
            task.then((d) => ref.getDownloadURL()).then((url) => {
                setDowloadURL(url);
                setUploading(false);
            });
        });
    };

    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <>
                    <label className="btn">
                        📷 Upload Img
                        <input
                            type="file"
                            onChange={uploadFile}
                            accept="image/x-png,image/gif,image/jpeg"
                        />
                    </label>

                    {dowloadURL && (
                        <code className="upload-snippet">
                            {`![alt](${dowloadURL})`}
                        </code>
                    )}
                </>
            )} 
        </div>
    );
};

export default ImageUploder;
