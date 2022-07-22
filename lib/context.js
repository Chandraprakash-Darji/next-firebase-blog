import { createContext } from "react";

// Context to share `user` and `username` across app
export const UserContext = createContext({user:null, username:null});