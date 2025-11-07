import React, { createContext, useState, useEffect, useCallback } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { User, Role, ApprovalStatus, DeliveryRequest, DeliveryStatus, GatePass, GatePassStatus, Announcement, Conversation, Message } from './types';

// IMPORTANT: Replace with your actual Supabase project URL and Anon Key.
// You can find these in your Supabase project's API settings.
const supabaseUrl = 'https://eqkxsrfypizmdaoqhavu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa3hzcmZ5cGl6bWRhb3FoYXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzU3MjMsImV4cCI6MjA3ODA1MTcyM30.Ywe0m882wb4UQ4FZQKC8lCnf2Gf611LdYrl82EcSL-8';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AuthContextType = {
    session: Session | null;
    currentUser: User | null;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    session: null,
    currentUser: null,
    logout: async () => {},
});

type DataContextType = {
    users: User[];
    updateUser: (user: User) => Promise<void>;
    deliveryRequests: DeliveryRequest[];
    addDeliveryRequest: (req: Partial<DeliveryRequest>) => Promise<DeliveryRequest | null>;
    updateDeliveryRequest: (req: DeliveryRequest) => Promise<void>;
    gatePasses: GatePass[];
    addGatePass: (gp: Partial<GatePass>) => Promise<GatePass | null>;
    updateGatePass: (gp: GatePass) => Promise<void>;
    announcements: Announcement[];
    conversations: Conversation[];
    addConversation: (participantIds: string[]) => Promise<Conversation | null>;
    messages: Message[];
    addMessage: (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => Promise<void>;
    markConversationAsRead: (conversationId: string, userId: string) => Promise<void>;
};

export const DataContext = createContext<DataContextType>({
    users: [],
    updateUser: async () => {},
    deliveryRequests: [],
    addDeliveryRequest: async () => null,
    updateDeliveryRequest: async () => {},
    gatePasses: [],
    addGatePass: async () => null,
    updateGatePass: async () => {},
    announcements: [],
    conversations: [],
    addConversation: async () => null,
    messages: [],
    addMessage: async () => {},
    markConversationAsRead: async () => {},
});


type Page = 'login' | 'signup' | 'dashboard';

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
    const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [page, setPage] = useState<Page>('login');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
             if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setCurrentUser(data as User);
            }
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                setCurrentUser(data as User);
                if (data?.approval_status === ApprovalStatus.APPROVED) {
                    setPage('dashboard');
                } else if (data) {
                     alert('Your account is pending approval or has been suspended.');
                }
            } else {
                setCurrentUser(null);
                setPage('login');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        const [usersRes, deliveriesRes, gatePassesRes, announcementsRes, conversationsRes, messagesRes] = await Promise.all([
            supabase.from('profiles').select('*'),
            supabase.from('delivery_requests').select('*').order('created_at', { ascending: false }),
            supabase.from('gate_passes').select('*').order('created_at', { ascending: false }),
            supabase.from('announcements').select('*').order('created_at', { ascending: false }),
            supabase.from('conversations').select('*').order('last_message_timestamp', { ascending: false }),
            supabase.from('messages').select('*').order('timestamp', { ascending: true }),
        ]);
        setUsers(usersRes.data as User[] || []);
        setDeliveryRequests(deliveriesRes.data as DeliveryRequest[] || []);
        setGatePasses(gatePassesRes.data as GatePass[] || []);
        setAnnouncements(announcementsRes.data as Announcement[] || []);
        setConversations(conversationsRes.data as Conversation[] || []);
        setMessages(messagesRes.data as Message[] || []);
        setLoading(false);
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchData();
        }
    }, [currentUser, fetchData]);
    
    // Realtime subscriptions
    useEffect(() => {
        const changes = supabase.channel('all-db-changes')
            .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
                console.log('Change received!', payload);
                fetchData(); // Refetch all data on any change for simplicity
            })
            .subscribe();
            
        return () => {
            supabase.removeChannel(changes);
        }
    }, [fetchData]);


    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setPage('login');
    };

    const updateUser = async (updatedUser: User) => {
        const { data, error } = await supabase.from('profiles').update(updatedUser).eq('id', updatedUser.id).select().single();
        if (error) console.error('Error updating user:', error);
        else {
            setUsers(users.map(user => user.id === updatedUser.id ? (data as User) : user));
            if (currentUser?.id === updatedUser.id) {
                setCurrentUser(data as User);
            }
        }
    };
    
    const addDeliveryRequest = async (req: Partial<DeliveryRequest>) => {
        const { data, error } = await supabase.from('delivery_requests').insert(req).select().single();
        if (error) { console.error('Error adding delivery:', error); return null; }
        setDeliveryRequests(prev => [data as DeliveryRequest, ...prev]);
        return data as DeliveryRequest;
    };
    
    const updateDeliveryRequest = async (updatedReq: DeliveryRequest) => {
        await supabase.from('delivery_requests').update(updatedReq).eq('id', updatedReq.id);
        setDeliveryRequests(prev => prev.map(req => req.id === updatedReq.id ? updatedReq : req));
    }

    const addGatePass = async (gp: Partial<GatePass>) => {
        const { data, error } = await supabase.from('gate_passes').insert(gp).select().single();
        if (error) { console.error('Error adding gate pass:', error); return null; }
        setGatePasses(prev => [data as GatePass, ...prev]);
        return data as GatePass;
    };
    
    const updateGatePass = async (updatedGP: GatePass) => {
        await supabase.from('gate_passes').update(updatedGP).eq('id', updatedGP.id);
        setGatePasses(prev => prev.map(gp => gp.id === updatedGP.id ? updatedGP : gp));
    };

    const addMessage = async (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
        const newMessage = { ...msg, timestamp: new Date().toISOString(), read: false };
        await supabase.from('messages').insert(newMessage);
        await supabase.from('conversations').update({ last_message_text: msg.text, last_message_timestamp: newMessage.timestamp }).eq('id', msg.conversation_id);
    };

    const addConversation = async (participantIds: string[]) => {
        const newConv = { participant_ids: participantIds, last_message_text: 'New conversation started', last_message_timestamp: new Date().toISOString() };
        const { data, error } = await supabase.from('conversations').insert(newConv).select().single();
        if (error) { console.error('Error adding conversation:', error); return null; }
        setConversations(prev => [data as Conversation, ...prev]);
        return data as Conversation;
    }
    
    const markConversationAsRead = useCallback(async (conversationId: string, userId: string) => {
        await supabase.from('messages').update({ read: true }).eq('conversation_id', conversationId).eq('receiver_id', userId);
    }, []);

    const dataContextValue = { users, updateUser, deliveryRequests, addDeliveryRequest, updateDeliveryRequest, gatePasses, addGatePass, updateGatePass, announcements, conversations, addConversation, messages, addMessage, markConversationAsRead };
    
    const navigateToSignUp = () => setPage('signup');
    const navigateToLogin = () => setPage('login');

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center text-gray-600 font-semibold">Loading EstateHub...</div>;
    }

    if (!session || !currentUser || currentUser.approval_status !== ApprovalStatus.APPROVED) {
        if (page === 'signup') {
            return <SignUp onNavigateToLogin={navigateToLogin} />;
        }
        return <Login onNavigateToSignUp={navigateToSignUp} />;
    }

    return (
        <AuthContext.Provider value={{ session, currentUser, logout }}>
            <DataContext.Provider value={dataContextValue}>
                {currentUser.role === Role.ADMIN ? <AdminDashboard /> : <Dashboard />}
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
