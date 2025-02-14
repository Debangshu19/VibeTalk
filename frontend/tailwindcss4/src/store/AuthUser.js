import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {io} from 'socket.io-client'

export const useAuthStore = create ((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isLoggingOut: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async() => {
        set({ isCheckingAuth: true });
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await axios.get(
                "http://localhost:5001/api/auth/check", 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Send token in the Authorization header
                    },
                    withCredentials: true,
                }
            );
            set({ authUser: response.data.user, isCheckingAuth: false });
            get().connectSocket();
        } catch (err) {
            set({ isCheckingAuth: false, authUser: null });
            toast.error("Failed to authenticate");
        }
    },

    signup: async (credentials) => {
        console.log(credentials);
        set({ isSigningUp: true });
        try {
            const response = await axios.post(
                "http://localhost:5001/api/auth/signup", 
                credentials, 
                { withCredentials: true }
            );
            // Store the token in localStorage and in the state
            localStorage.setItem('jwtToken', response.data.token);
            set({ authUser: response.data.user, token: response.data.token, isSigningUp: false });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Sign Up failed");
            set({ isSigningUp: false, authUser: null });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            const response = await axios.post("http://localhost:5001/api/auth/logout");
            // Remove the token from localStorage
            localStorage.removeItem('jwtToken');
            set({ authUser: null, token: null, isLoggingOut: false });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (err) {
            set({ isLoggingOut: false });
            toast.error(err.response.data.message || "Log out failed");
        }
    },

    login: async (credentials) => {
        console.log(credentials);
        set({ isLoggingIn: true });
        try {
            const response = await axios.post(
                "http://localhost:5001/api/auth/login", 
                credentials, 
                { withCredentials: true }
            );
            // Store the token in localStorage and in the state
            localStorage.setItem('jwtToken', response.data.token);
            set({ authUser: response.data.user, token: response.data.token, isLoggingIn: false });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Log in failed");
            set({ isLoggingIn: false, authUser: null });
        }
    },

    updateProfile: async(credentials) =>{
        set({isUpdatingProfile: true});
        try{
            const response = await axios.put(
                "http://localhost:5001/api/auth/update-profile",
                credentials, 
                { withCredentials: true }
            );
            set({ authUser: response.data, isUpdatingProfile: false});
            toast.success("Profile Updated successfully");
        }catch(err){
            toast.error(err.response.data.message || "Profile update failed");
            set({ isUpdatingProfile: false});
        }
    },

    connectSocket: () =>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected){
            return;
        }
        const socket = io("http://localhost:5001",{
            query: {
                userId: authUser._id
            }
        });

        socket.connect();
        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds}) //all the users that are online
        });
    },

    disconnectSocket: () => {
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    }
}));