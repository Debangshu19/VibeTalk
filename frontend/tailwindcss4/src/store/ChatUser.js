import {create} from 'zustand'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import {useAuthStore} from './AuthUser'

export const useChatStore = create((set,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const response = await axios.get("https://vibetalk-cgva.onrender.com/api/message/users", {withCredentials: true});
          console.log("API Response:", response.data); // Debug: Check API response
          set({ users: response.data, isUsersLoading: false });
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to fetch users");
          set({ isUsersLoading: false });
        }
      },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true});
        try{
            const response = await axios.get(`https://vibetalk-cgva.onrender.com/api/message/${userId}`, {withCredentials: true});
            set({messages: response.data, isMessagesLoading: false});
        }catch(err){
            toast.error(err.response.data.message || "Messages getting failed");
            set({ isMessagesLoading: false});
        }
    },
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get(); //we are getting this after user is selected and message is written.(this is not the above state)
        try{
            const response = await axios.post(`https://vibetalk-cgva.onrender.com/api/message/send/${selectedUser._id}`, messageData, {withCredentials: true});
            set({messages: [...messages,response.data]});
        }catch(err){
            toast.error(err.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser)   return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser)  return;
            
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },

    unsubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({selectedUser}),
}));
