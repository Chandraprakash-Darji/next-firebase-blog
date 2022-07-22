import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../lib/context";
import Image from 'next/image';
const Navbar = () => {
    // Getting the user and userName by context
    const { user, username } = useContext(UserContext);
    return (
        <div className="navbar">
            <ul>
                <li>
                    <Link href={"/"}>
                        <button className="btn-logo">Feed</button>
                    </Link>
                </li>
                {/* User is signed-in and has username */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href={"/admin"}>
                                <button className="btn-blue">Write Post</button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <Image
                                    src={user?.photoURL}
                                    alt={user?.displayName}
                                    width={50}
                                    height={50}
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* User is not signed OR has not created username */}
                {!username && (
                    <>
                        <li>
                            <Link href={"/enter"}>
                                <button className="btn-blue">Log In</button>
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
