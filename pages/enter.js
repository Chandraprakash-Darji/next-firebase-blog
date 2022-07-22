import debounce from "lodash.debounce";
import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, goggleAuthProvider } from "../lib/firebase";
import Image from "next/image";
const SignUppage = () => {
    const { user, username } = useContext(UserContext);
    // 1. user SignedOut => <SignInButton />
    // 2. user Signed In, but missing username => <UsernameForm />
    // 3. user Signed In, and has username => <SignOutButton />
    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </main>
    );
};

export default SignUppage;

const SignInButton = () => {
    // Simple SignIn
    const signInWithGoggle = async () => {
        await auth.signInWithPopup(goggleAuthProvider);
    };
    return (
        <button className="btn-google" onClick={signInWithGoggle}>
            <Image src="/goggle.png" alt="google" width={30} height={30} /> Sign
            in with Goggle
        </button>
    );
};

const SignOutButton = () => {
    // SignOut
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

const UsernameForm = () => {
    // Form to get username
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // create refs for both documetn
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        // Commit both docs together as a batch write
        const batch = firestore.batch();
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName,
        });
        batch.set(usernameDoc, { uid: user.uid });
        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setIsValid(false);
            setLoading(false);
        }
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    // Whenever username field change it will check for username
    useEffect(() => {
        checkUserName(formValue);
    }, [formValue, checkUserName]);

    const checkUserName = useMemo(
        () =>
            debounce(async (username) => {
                if (
                    username.length >= 3 &&
                    username !== "enter" &&
                    username !== "admin"
                ) {
                    const ref = firestore.doc(`usernames/${username}`);
                    const { exists } = await ref.get();
                    console.log("FiresStore read Executed");
                    setIsValid(!exists);
                    setLoading(false);
                } else {
                    setLoading(false);
                    setIsValid(false);
                }
            }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        name="username"
                        placeholder="username"
                        value={formValue}
                        onChange={onChange}
                    />

                    <UserNameMessage
                        username={formValue}
                        isValid={isValid}
                        loading={loading}
                    />

                    <button
                        className="btn-green"
                        type="submit"
                        disabled={!isValid}
                    >
                        Choose
                    </button>
                    <h3>Debug State</h3>
                    <div>
                        username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        UserName Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
};

function UserNameMessage({ username, isValid, loading }) {
    if (loading) return <div>Checking...</div>;
    else if (isValid)
        return <p className="text-success">{username} is available</p>;
    else if (username && !isValid)
        return <p className="text-danger">That username is taken</p>;
    else return <p></p>;
}
