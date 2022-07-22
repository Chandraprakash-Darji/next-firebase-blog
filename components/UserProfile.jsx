import Image from "next/image";
import React from "react";

const UserProfile = ({ user }) => {
    return (
        <div className="box-center">
            <div className="card-img-center">
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                    }}
                >
                    <Image
                        src={user.photoURL}
                        alt={user.displayName}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            </div>
            <p>
                <i>@{user.username}</i>
            </p>
            <h1>{user.displayName}</h1>
        </div>
    );
};

export default UserProfile;
