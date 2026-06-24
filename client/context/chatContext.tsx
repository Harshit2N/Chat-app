import { createContext, useContext, useEffect, useState, ReactNode, FC } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";


interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    seen: boolean;
    createdAt: string;
    [key: string]: any;
}

interface User {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    [key: string]: any;
}

interface ChatContextType {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    unseenMessages: Record<string, number>;
    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: any) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    setUnseenMessages: (unseenMessages: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children })=>{

    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>({})

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('ChatProvider must be used within AuthProvider');
    }
    const { socket, axios } = context;

    // function to get all users for sidebar
    const getUsers = async (): Promise<void> =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId: string): Promise<void> =>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success){
                setMessages(data.messages)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData: any): Promise<void> =>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser?._id}`, messageData);
            if(data.success){
                setMessages((prevMessages: Message[]) =>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = async (): Promise<void> =>{
        if(!socket) return;

        socket.on("newMessage", (newMessage: Message)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages: Message[])=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages: Record<string, number>)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = (): void =>{
        if(socket) socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const value: ChatContextType = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
    <ChatContext.Provider value={value}>
            { children }
    </ChatContext.Provider>
    )
}