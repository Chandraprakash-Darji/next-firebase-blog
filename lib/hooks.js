import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

// Hook for fetching user when App opened
export function useUserData() {
    // get the current user logegd in
    const [user] = useAuthState(auth);
    // State for username
    const [username, setUsername] = useState(null);

    useEffect(() => {
        // unsubscribe for making connnection with database
        let unsubscribe;
        if (user) {
            // Connecting to the user data to find all data of current user
            const ref = firestore.collection("users").doc(user.uid);
            // If any user changes then it will setUsername
            unsubscribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);
            });
            // else set it null if user is not loged in
        } else setUsername(null);
        // returning to unsubscribe when the event complete
        return unsubscribe;
        // Re run when user change to set the `userName`
    }, [user]);
    // Every time update and return new `user` and `usernamw`
    return { user, username };
}
