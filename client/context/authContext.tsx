import { createContext, useEffect, useState, ReactNode, FC } from "react";
import axios, { AxiosInstance } from 'axios'
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client"


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

interface AuthUser {
    _id: string;
    [key: string]: any;
}

interface AuthContextType {
    axios: AxiosInstance;
    authUser: AuthUser | null;
    onlineUsers: string[];
    socket: Socket | null;
    login: (state: string, credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (body: any) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children })=>{

    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState<AuthUser | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async (): Promise<void> => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Login function to handle user authentication and socket connection

    const login = async (state: string, credentials: any): Promise<void> =>{
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Logout function to handle user logout and socket disconnection

    const logout = async (): Promise<void> =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully")
        socket?.disconnect();
    }

    // Update profile function to handle user profile updates

    const updateProfile = async (body: any): Promise<void> =>{
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    // Connect socket function to handle socket connection and online users updates
    const connectSocket = (userData: AuthUser): void =>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds: string[]) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])

    const value: AuthContextType = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}