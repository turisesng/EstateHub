import React, { createContext, useState, useCallback } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, Role, ApprovalStatus, DeliveryRequest, DeliveryStatus, GatePass, GatePassStatus, Announcement, Conversation, Message } from './types';
import { USERS, DELIVERY_REQUESTS, GATE_PASSES, ANNOUNCEMENTS, CONVERSATIONS, MESSAGES } from './constants';

type AuthContextType = {
    currentUser: User | null;
    login: (email: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => {},
    logout: () => {},
});

type DataContextType = {
    users: User[];
    addUser: (user: Partial<User>) => void;
    updateUser: (user: User) => void;
    deliveryRequests: DeliveryRequest[];
    addDeliveryRequest: (req: Omit<DeliveryRequest, 'id' | 'createdAt' | 'status'> & { status?: DeliveryStatus }) => DeliveryRequest;
    updateDeliveryRequest: (req: DeliveryRequest) => void;
    gatePasses: GatePass[];
    addGatePass: (gp: Omit<GatePass, 'id' | 'status' | 'qrCode'>) => GatePass;
    updateGatePass: (gp: GatePass) => void;
    announcements: Announcement[];
    conversations: Conversation[];
    addConversation: (participantIds: string[]) => Conversation;
    messages: Message[];
    addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
    markConversationAsRead: (conversationId: string, userId: string) => void;
};

export const DataContext = createContext<DataContextType>({
    users: [],
    addUser: () => {},
    updateUser: () => {},
    deliveryRequests: [],
    addDeliveryRequest: () => ({} as DeliveryRequest),
    updateDeliveryRequest: () => {},
    gatePasses: [],
    addGatePass: () => ({} as GatePass),
    updateGatePass: () => {},
    announcements: [],
    conversations: [],
    addConversation: () => ({} as Conversation),
    messages: [],
    addMessage: () => {},
    markConversationAsRead: () => {},
});


type Page = 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(USERS);
    const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(DELIVERY_REQUESTS);
    const [gatePasses, setGatePasses] = useState<GatePass[]>(GATE_PASSES);
    const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
    const [messages, setMessages] = useState<Message[]>(MESSAGES);
    const [page, setPage] = useState<Page>('login');

    const login = (email: string) => {
        const user = users.find(u => u.email === email);
        if (user) {
            if (user.approvalStatus !== ApprovalStatus.APPROVED) {
                alert('Your account is pending approval or has been suspended.');
                return;
            }
            setCurrentUser(user);
            setPage('dashboard');
        } else {
            alert('User not found!');
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setPage('login');
    };

    const addUser = (userData: Partial<User>) => {
        const newUser: User = {
            id: `newUser${Date.now()}`,
            approvalStatus: ApprovalStatus.PENDING,
            lat: 6.5244 + (Math.random() - 0.5) * 0.01,
            lng: 3.3792 + (Math.random() - 0.5) * 0.01,
            operatesOutsideEstate: false,
            ...userData,
        } as User;
        setUsers(prevUsers => [...prevUsers, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        if (currentUser?.id === updatedUser.id) {
            setCurrentUser(updatedUser);
        }
    };

    const addDeliveryRequest = (req: Omit<DeliveryRequest, 'id' | 'createdAt' | 'status'> & { status?: DeliveryStatus }) => {
        const newReq: DeliveryRequest = {
            ...req,
            id: `del${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: req.status || DeliveryStatus.PENDING,
        };
        setDeliveryRequests(prev => [newReq, ...prev]);
        return newReq;
    };
    
    const updateDeliveryRequest = (updatedReq: DeliveryRequest) => {
        setDeliveryRequests(prev => prev.map(req => req.id === updatedReq.id ? updatedReq : req));
    }

    const addGatePass = (gp: Omit<GatePass, 'id' | 'status' | 'qrCode'>) => {
        const newGP: GatePass = {
            ...gp,
            id: `gp${Date.now()}`,
            status: GatePassStatus.PENDING,
            qrCode: 'pending',
        };
        setGatePasses(prev => [newGP, ...prev]);
        return newGP;
    };
    
    const updateGatePass = (updatedGP: GatePass) => {
        setGatePasses(prev => prev.map(gp => gp.id === updatedGP.id ? updatedGP : gp));

        // Security Workflow Logic: Update linked delivery on gate pass status change
        if (updatedGP.linkedDeliveryId) {
            const delivery = deliveryRequests.find(d => d.id === updatedGP.linkedDeliveryId);
            if (delivery && delivery.status === DeliveryStatus.AWAITING_GATE_PASS) {
                if (updatedGP.status === GatePassStatus.APPROVED) {
                    updateDeliveryRequest({ ...delivery, status: DeliveryStatus.PENDING });
                } else if (updatedGP.status === GatePassStatus.DECLINED) {
                    updateDeliveryRequest({ ...delivery, status: DeliveryStatus.CANCELLED });
                }
            }
        }
    };

    const addMessage = (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
        const newMessage: Message = {
            ...msg,
            id: `msg${Date.now()}`,
            timestamp: new Date().toISOString(),
            read: false,
        };
        setMessages(prev => [...prev, newMessage]);

        // Update conversation's last message
        setConversations(prev => prev.map(c => c.id === msg.conversationId ? {
            ...c,
            lastMessage: { text: msg.text, timestamp: newMessage.timestamp }
        } : c));
    };

    const addConversation = (participantIds: string[]) => {
        const newConv: Conversation = {
            id: `conv${Date.now()}`,
            participantIds,
            lastMessage: { text: 'New conversation started', timestamp: new Date().toISOString() },
        };
        setConversations(prev => [newConv, ...prev]);
        return newConv;
    }
    
    const markConversationAsRead = useCallback((conversationId: string, userId: string) => {
        setMessages(prev => prev.map(msg =>
            (msg.conversationId === conversationId && msg.receiverId === userId && !msg.read)
                ? { ...msg, read: true }
                : msg
        ));
    }, []);

    
    const navigateToSignUp = () => setPage('signup');
    const navigateToLogin = () => setPage('login');

    const dataContextValue = {
        users,
        addUser,
        updateUser,
        deliveryRequests,
        addDeliveryRequest,
        updateDeliveryRequest,
        gatePasses,
        addGatePass,
        updateGatePass,
        announcements: ANNOUNCEMENTS,
        conversations,
        addConversation,
        messages,
        addMessage,
        markConversationAsRead,
    };

    if (!currentUser) {
        if (page === 'signup') {
            return (
                <DataContext.Provider value={dataContextValue}>
                    <SignUp onNavigateToLogin={navigateToLogin} />
                </DataContext.Provider>
            );
        }
        return (
            <AuthContext.Provider value={{ currentUser, login, logout }}>
                 <Login onNavigateToSignUp={navigateToSignUp} />
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            <DataContext.Provider value={dataContextValue}>
                {currentUser.role === Role.ADMIN ? (
                    <AdminDashboard />
                ) : (
                    <Dashboard />
                )}
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;