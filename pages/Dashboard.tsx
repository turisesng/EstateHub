import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext, DataContext } from '../App';
import { User, Role, DeliveryRequest, DeliveryStatus, GatePass, GatePassStatus, Conversation, Message, RiderUser, ApprovalStatus } from '../types';
import { HomeIcon, DeliveryIcon, GatePassIcon, ChatIcon, ProfileIcon, LogoutIcon, StoreIcon, ServiceIcon, RiderIcon, QrCodeIcon, ClockIcon, CheckCircleIcon, XCircleIcon, SendIcon, ReadReceiptIcon } from '../components/icons';

// Utility Functions
const getStatusClass = (status: DeliveryStatus) => {
    switch (status) {
        case DeliveryStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case DeliveryStatus.ACCEPTED: return 'bg-blue-100 text-blue-800';
        case DeliveryStatus.IN_TRANSIT: return 'bg-indigo-100 text-indigo-800';
        case DeliveryStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case DeliveryStatus.CANCELLED: return 'bg-red-100 text-red-800';
        case DeliveryStatus.AWAITING_GATE_PASS: return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getGatePassStatusClass = (status: GatePassStatus) => {
    switch (status) {
        case GatePassStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case GatePassStatus.APPROVED: return 'bg-green-100 text-green-800';
        case GatePassStatus.DECLINED: return 'bg-red-100 text-red-800';
        case GatePassStatus.USED: return 'bg-blue-100 text-blue-800';
        case GatePassStatus.EXPIRED: return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// Main Dashboard Component
const Dashboard: React.FC = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('home');
    const [activeDirectory, setActiveDirectory] = useState<'stores' | 'services' | 'riders' | null>(null);
    const [activeProfile, setActiveProfile] = useState<User | null>(null);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

    const navItems = [
        { id: 'home', label: 'Home', icon: HomeIcon, roles: [Role.RESIDENT, Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER] },
        { id: 'deliveries', label: 'My Deliveries', icon: DeliveryIcon, roles: [Role.RESIDENT, Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER] },
        { id: 'gatepass', label: 'Gate Pass', icon: GatePassIcon, roles: [Role.RESIDENT] },
        { id: 'request_rider', label: 'Request Rider', icon: RiderIcon, roles: [Role.STORE, Role.SERVICE_PROVIDER] },
        { id: 'directory_stores', label: 'Stores', icon: StoreIcon, roles: [Role.RESIDENT] },
        { id: 'directory_services', label: 'Services', icon: ServiceIcon, roles: [Role.RESIDENT] },
        { id: 'directory_riders', label: 'Riders', icon: RiderIcon, roles: [Role.RESIDENT] },
        { id: 'chat', label: 'Chat', icon: ChatIcon, roles: [Role.RESIDENT, Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER] },
        { id: 'profile', label: 'My Profile', icon: ProfileIcon, roles: [Role.RESIDENT, Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER] },
    ];

    const handleNavClick = (viewId: string) => {
        setActiveDirectory(null);
        setActiveProfile(null);
        setActiveConversation(null);

        if (viewId.startsWith('directory_')) {
            const dir = viewId.split('_')[1] as 'stores' | 'services' | 'riders';
            setActiveDirectory(dir);
            setActiveView('directory');
        } else {
            setActiveView(viewId);
        }
    };

    const viewDirectoryProfile = (user: User) => {
        setActiveProfile(user);
        setActiveView('directory_profile');
    };

    const dataContext = useContext(DataContext);

    const startChat = (targetUser: User) => {
        if (!currentUser) return;
        const { conversations, addConversation } = dataContext;
        const existingConv = conversations.find(c => c.participantIds.includes(currentUser.id) && c.participantIds.includes(targetUser.id));
        if (existingConv) {
            setActiveConversation(existingConv);
        } else {
            const newConv = addConversation([currentUser.id, targetUser.id]);
            setActiveConversation(newConv);
        }
        setActiveView('chat');
    };
    
    if (!currentUser) return <div>Loading...</div>;

    const userNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

    const renderView = () => {
        switch(activeView) {
            case 'home': return <HomeView />;
            case 'deliveries': return <DeliveriesView startChat={startChat} />;
            case 'gatepass': return <GatePassView />;
            case 'request_rider': return <RequestRiderView />;
            case 'directory': return <DirectoryView directory={activeDirectory} viewProfile={viewDirectoryProfile} />;
            case 'directory_profile': return <DirectoryProfileView user={activeProfile} startChat={startChat} />;
            case 'chat': return <ChatView activeConversation={activeConversation} setActiveConversation={setActiveConversation} startChat={startChat} />;
            case 'profile': return <ProfileView />;
            default: return <HomeView />;
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r">
                 <div className="h-16 flex items-center justify-center border-b">
                    <h1 className="text-2xl font-bold text-brand-primary">EstateHub</h1>
                </div>
                <nav className="flex-grow p-2 space-y-1">
                    {userNavItems.map(item => (
                        <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors text-left ${((activeView === item.id) || (activeView === 'directory' && item.id.startsWith(`directory_${activeDirectory}`))) ? 'bg-teal-50 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                            <item.icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                 <div className="p-2 border-t">
                    <button onClick={logout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-left">
                        <LogoutIcon className="h-6 w-6" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="md:hidden h-16 bg-white border-b flex justify-between items-center px-4">
                    <h1 className="text-xl font-bold text-brand-primary">EstateHub</h1>
                    <img src={currentUser.photoUrl} alt={currentUser.name} className="h-8 w-8 rounded-full object-cover" />
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    {renderView()}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t grid grid-cols-5 gap-1 p-1">
                {userNavItems.slice(0, 5).map(item => ( // Show first 5 items
                    <button key={item.id} onClick={() => handleNavClick(item.id)} className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${((activeView === item.id) || (activeView === 'directory' && item.id.startsWith(`directory_${activeDirectory}`))) ? 'text-brand-primary' : 'text-gray-500'}`}>
                        <item.icon className="h-6 w-6 mb-1" />
                        <span className="text-xs">{item.label.split(' ')[0]}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};


// View Components
const HomeView = () => {
    const { currentUser } = useContext(AuthContext);
    const { announcements } = useContext(DataContext);
    if (!currentUser) return null;

    const getRoleClass = (role: Role) => {
        switch (role) {
            case Role.RESIDENT: return 'bg-blue-100 text-blue-800';
            case Role.DISPATCH_RIDER: return 'bg-yellow-100 text-yellow-800';
            case Role.STORE: return 'bg-purple-100 text-purple-800';
            case Role.SERVICE_PROVIDER: return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="flex items-center space-x-4 mb-6">
                <img src={currentUser.photoUrl} alt={currentUser.name} className="h-16 w-16 rounded-full object-cover"/>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleClass(currentUser.role)}`}>{currentUser.role}</span>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Estate Announcements</h2>
                <div className="space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className="border-l-4 border-brand-primary pl-4">
                            <h3 className="font-bold">{ann.title}</h3>
                            <p className="text-gray-600">{ann.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(ann.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DeliveriesView: React.FC<{ startChat: (user: User) => void }> = ({ startChat }) => {
    const { currentUser } = useContext(AuthContext);
    const { deliveryRequests, updateDeliveryRequest, users } = useContext(DataContext);
    const [activeTab, setActiveTab] = useState(currentUser?.role === Role.DISPATCH_RIDER ? 'available' : 'my_requests');

    if (!currentUser) return null;

    // Rider's View
    if (currentUser.role === Role.DISPATCH_RIDER) {
        const myJobs = deliveryRequests.filter(d => d.riderId === currentUser.id && d.status !== DeliveryStatus.COMPLETED && d.status !== DeliveryStatus.CANCELLED);
        const availableJobs = deliveryRequests.filter(d => d.status === DeliveryStatus.PENDING)
            .sort((a, b) => {
                const distA = haversineDistance(currentUser.lat, currentUser.lng, a.pickupLat, a.pickupLng);
                const distB = haversineDistance(currentUser.lat, currentUser.lng, b.pickupLat, b.pickupLng);
                return distA - distB;
            });

        const handleAcceptJob = (req: DeliveryRequest) => {
            updateDeliveryRequest({ ...req, riderId: currentUser.id, riderName: currentUser.name, status: DeliveryStatus.ACCEPTED });
        }
        const handleUpdateStatus = (req: DeliveryRequest, status: DeliveryStatus) => {
            updateDeliveryRequest({ ...req, status });
        }
        
        return (
            <div>
                 <div className="flex border-b mb-4">
                    <button onClick={() => setActiveTab('available')} className={`px-4 py-2 font-semibold ${activeTab === 'available' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>Available Jobs</button>
                    <button onClick={() => setActiveTab('my_jobs')} className={`px-4 py-2 font-semibold ${activeTab === 'my_jobs' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500'}`}>My Jobs</button>
                </div>

                {activeTab === 'available' && (
                    <div className="space-y-4">
                        {availableJobs.map(req => (
                             <div key={req.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{req.description}</p>
                                        <p className="text-sm text-gray-500">From: {req.pickupAddress}</p>
                                        <p className="text-sm text-gray-500">To: {req.dropoffAddress}</p>
                                        <p className="text-sm text-gray-500">By: {req.requesterName}</p>
                                        <p className="text-xs text-blue-600 font-semibold mt-1">~{haversineDistance(currentUser.lat, currentUser.lng, req.pickupLat, req.pickupLng).toFixed(2)} km away</p>
                                    </div>
                                    <button onClick={() => handleAcceptJob(req)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">Accept</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'my_jobs' && (
                     <div className="space-y-4">
                        {myJobs.map(req => {
                            const requester = users.find(u => u.id === req.requesterId);
                            return (
                                <div key={req.id} className="bg-white p-4 rounded-lg shadow-md">
                                     <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold">{req.description}</p>
                                            <p className="text-sm text-gray-500">From: {req.pickupAddress}</p>
                                            <p className="text-sm text-gray-500">To: {req.dropoffAddress}</p>
                                            <p className="text-sm text-gray-500">By: {req.requesterName}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span>
                                    </div>
                                    <div className="flex space-x-2 mt-2">
                                        {req.status === DeliveryStatus.ACCEPTED && <button onClick={() => handleUpdateStatus(req, DeliveryStatus.IN_TRANSIT)} className="bg-blue-500 text-white px-3 py-1 text-sm rounded">Start</button>}
                                        {req.status === DeliveryStatus.IN_TRANSIT && <button onClick={() => handleUpdateStatus(req, DeliveryStatus.COMPLETED)} className="bg-green-500 text-white px-3 py-1 text-sm rounded">Complete</button>}
                                        {requester && <button onClick={() => startChat(requester)} className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded">Chat</button>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        )
    }

    // Resident, Store, Service Provider View
    const myRequests = deliveryRequests.filter(d => d.requesterId === currentUser.id);
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">My Delivery Requests</h1>
            {myRequests.map(req => {
                const rider = users.find(u => u.id === req.riderId);
                return (
                    <div key={req.id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">{req.description}</p>
                                <p className="text-sm text-gray-500">From: {req.pickupAddress}</p>
                                <p className="text-sm text-gray-500">To: {req.dropoffAddress}</p>
                                {req.riderName && <p className="text-sm text-gray-500">Rider: {req.riderName}</p>}
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span>
                        </div>
                        {rider && req.status !== DeliveryStatus.COMPLETED && req.status !== DeliveryStatus.CANCELLED && (
                             <div className="mt-2">
                                 <button onClick={() => startChat(rider)} className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded">Chat with Rider</button>
                             </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

const GatePassView = () => {
    const { currentUser } = useContext(AuthContext);
    const { gatePasses, addGatePass, deliveryRequests } = useContext(DataContext);
    const [formData, setFormData] = useState({ visitorName: '', purpose: '', visitDateTime: '' });
    if (!currentUser) return null;

    const myGatePasses = gatePasses.filter(gp => gp.residentId === currentUser.id);
    const pendingPasses = myGatePasses.filter(gp => gp.status === GatePassStatus.PENDING);
    const historyPasses = myGatePasses.filter(gp => gp.status !== GatePassStatus.PENDING);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.visitDateTime) {
            alert("Please select a date and time for the visit.");
            return;
        }
        addGatePass({
            residentId: currentUser.id,
            residentName: currentUser.name,
            visitorName: formData.visitorName,
            purpose: formData.purpose,
            visitDateTime: formData.visitDateTime,
            visitorType: Role.RESIDENT, // Placeholder for generic visitor
        });
        setFormData({ visitorName: '', purpose: '', visitDateTime: '' });
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    return (
         <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                 <h2 className="text-xl font-semibold mb-4">Request a New Gate Pass</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="visitorName" type="text" placeholder="Visitor's Name" value={formData.visitorName} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <input name="purpose" type="text" placeholder="Purpose of Visit" value={formData.purpose} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                    <div>
                        <label htmlFor="visitDateTime" className="block text-sm font-medium text-gray-700">Date and Time of Visit</label>
                        <input id="visitDateTime" name="visitDateTime" type="datetime-local" value={formData.visitDateTime} onChange={handleInputChange} className="w-full p-2 border rounded mt-1" required />
                    </div>
                    <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Submit Request</button>
                </form>
            </div>
            
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                <div className="space-y-4">
                    {pendingPasses.map(gp => (
                        <div key={gp.id} className="bg-white p-4 rounded-lg shadow-md">
                           <p className="font-bold">{gp.visitorName}</p>
                           <p className="text-sm text-gray-500">{gp.purpose}</p>
                           <p className="text-xs text-gray-400 mt-1">{new Date(gp.visitDateTime).toLocaleString()}</p>
                           <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${getGatePassStatusClass(gp.status)}`}>{gp.status}</span>
                        </div>
                    ))}
                </div>
            </div>

             <div>
                <h2 className="text-xl font-semibold mb-4">Gate Pass History</h2>
                <div className="space-y-4">
                    {historyPasses.map(gp => {
                        const linkedDelivery = gp.linkedDeliveryId ? deliveryRequests.find(d => d.id === gp.linkedDeliveryId) : null;
                        return (
                            <div key={gp.id} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                       <p className="font-bold">{gp.visitorName}</p>
                                       <p className="text-sm text-gray-500">{gp.purpose}</p>
                                       <p className="text-xs text-gray-400 mt-1">{new Date(gp.visitDateTime).toLocaleString()}</p>
                                    </div>
                                   <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getGatePassStatusClass(gp.status)}`}>{gp.status}</span>
                               </div>
                               {linkedDelivery && (
                                   <div className="mt-3 pt-3 border-t border-gray-200">
                                       <p className="text-xs font-semibold text-gray-500 mb-1">Linked Delivery:</p>
                                       <div className="flex justify-between items-center">
                                           <p className="text-sm text-gray-700">{linkedDelivery.description}</p>
                                           <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(linkedDelivery.status)}`}>
                                               {linkedDelivery.status}
                                           </span>
                                       </div>
                                   </div>
                               )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const RequestRiderView = () => {
    const { currentUser } = useContext(AuthContext);
    const { addDeliveryRequest, deliveryRequests } = useContext(DataContext);
    const [formData, setFormData] = useState({ pickupAddress: currentUser?.address || '', dropoffAddress: '', description: '' });
    if (!currentUser) return null;

    const myRequests = deliveryRequests.filter(d => d.requesterId === currentUser.id);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addDeliveryRequest({
            requesterId: currentUser.id,
            requesterName: currentUser.name,
            pickupAddress: formData.pickupAddress,
            dropoffAddress: formData.dropoffAddress,
            description: formData.description,
            pickupLat: currentUser.lat,
            pickupLng: currentUser.lng,
        });
        setFormData({ pickupAddress: currentUser.address || '', dropoffAddress: '', description: '' });
    };

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Request a Rider</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <textarea placeholder="Pickup Address" value={formData.pickupAddress} onChange={e => setFormData({...formData, pickupAddress: e.target.value})} className="w-full p-2 border rounded" required rows={2}/>
                     <textarea placeholder="Drop-off Address" value={formData.dropoffAddress} onChange={e => setFormData({...formData, dropoffAddress: e.target.value})} className="w-full p-2 border rounded" required rows={2}/>
                     <textarea placeholder="Delivery Instructions" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" required rows={3}/>
                    <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Submit Request</button>
                </form>
            </div>
             <div>
                <h2 className="text-xl font-semibold mb-4">My Past Requests</h2>
                <div className="space-y-4">
                    {myRequests.map(req => (
                        <div key={req.id} className="bg-white p-4 rounded-lg shadow-md">
                           <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">{req.description}</p>
                                    <p className="text-sm text-gray-500">To: {req.dropoffAddress}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const DirectoryView: React.FC<{ directory: 'stores' | 'services' | 'riders' | null, viewProfile: (user: User) => void }> = ({ directory, viewProfile }) => {
    const { currentUser } = useContext(AuthContext);
    const { users, addDeliveryRequest, addGatePass } = useContext(DataContext);
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [selectedRider, setSelectedRider] = useState<RiderUser | null>(null);

    if (!directory || !currentUser) return null;

    const roleMap = { stores: Role.STORE, services: Role.SERVICE_PROVIDER, riders: Role.DISPATCH_RIDER };
    const titleMap = { stores: 'Stores', services: 'Service Providers', riders: 'Dispatch Riders' };

    const directoryUsers = users.filter(u => u.role === roleMap[directory] && u.approvalStatus === ApprovalStatus.APPROVED);

    if (directory === 'riders') {
        directoryUsers.sort((a, b) => {
            if (a.role !== Role.DISPATCH_RIDER || b.role !== Role.DISPATCH_RIDER) return 0;
            const distA = haversineDistance(currentUser.lat, currentUser.lng, a.lat, a.lng);
            const distB = haversineDistance(currentUser.lat, currentUser.lng, b.lat, b.lng);
            return distA - distB;
        });
    }

    const openRequestModal = (rider: User) => {
        if (rider.role === Role.DISPATCH_RIDER) {
            setSelectedRider(rider);
            setRequestModalOpen(true);
        }
    }
    
    return (
         <div>
            <h1 className="text-2xl font-bold mb-4">{titleMap[directory]}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directoryUsers.map(user => {
                     if (user.role === Role.DISPATCH_RIDER && !user.isOnline) return null; // Hide offline riders
                     
                     const distance = user.role === Role.DISPATCH_RIDER ? haversineDistance(currentUser.lat, currentUser.lng, user.lat, user.lng).toFixed(2) : null;
                     const rating = user.role === Role.DISPATCH_RIDER ? user.rating : null;

                     return (
                        <div key={user.id} className="bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-center space-x-4">
                                <img src={user.photoUrl} alt={user.name} className="h-16 w-16 rounded-full object-cover"/>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold pr-2">{ 'businessName' in user && user.businessName ? user.businessName : user.name}</p>
                                        {(user.role === Role.STORE || user.role === Role.SERVICE_PROVIDER || user.role === Role.DISPATCH_RIDER) && (
                                            <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-semibold rounded-full ${user.operatesOutsideEstate ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.operatesOutsideEstate ? 'Outside Estate' : 'Inside Estate'}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{user.address}</p>
                                    {rating && <p className="text-sm font-semibold text-yellow-500">⭐ {rating}</p>}
                                    {distance && <p className="text-sm font-semibold text-blue-500">~{distance} km away</p>}
                                </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
                               <button onClick={() => viewProfile(user)} className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 text-sm rounded-lg font-semibold">Profile</button>
                               {currentUser.role === Role.RESIDENT && user.role === Role.DISPATCH_RIDER && (
                                   <button onClick={() => openRequestModal(user)} className="flex-1 bg-brand-primary text-white px-3 py-2 text-sm rounded-lg font-semibold">Request</button>
                               )}
                            </div>
                        </div>
                     )
                })}
            </div>
            {requestModalOpen && selectedRider && (
                <RequestRiderModal 
                    rider={selectedRider} 
                    onClose={() => setRequestModalOpen(false)}
                    currentUser={currentUser}
                    addDeliveryRequest={addDeliveryRequest}
                    addGatePass={addGatePass}
                />
            )}
        </div>
    )
};

const RequestRiderModal: React.FC<{
    rider: RiderUser;
    onClose: () => void;
    currentUser: User;
    addDeliveryRequest: (req: Omit<DeliveryRequest, 'id' | 'createdAt' | 'status'> & { status?: DeliveryStatus }) => DeliveryRequest;
    addGatePass: (gp: Omit<GatePass, 'id' | 'status' | 'qrCode'>) => GatePass;
}> = ({ rider, onClose, currentUser, addDeliveryRequest, addGatePass }) => {
    const [formData, setFormData] = useState({ pickupAddress: currentUser.address, dropoffAddress: '', description: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rider.operatesOutsideEstate) {
            // Create the delivery request first to get its ID
            const newDelivery = addDeliveryRequest({
                requesterId: currentUser.id,
                requesterName: currentUser.name,
                ...formData,
                status: DeliveryStatus.AWAITING_GATE_PASS,
                pickupLat: currentUser.lat,
                pickupLng: currentUser.lng,
            });

            // Now create the gate pass and link it in one step
            addGatePass({
                residentId: currentUser.id,
                residentName: currentUser.name,
                visitorName: rider.name,
                visitorType: rider.role,
                purpose: `Delivery pickup for job #${newDelivery.id}`,
                targetVisitorId: rider.id,
                visitDateTime: new Date().toISOString(), // Immediate request
                linkedDeliveryId: newDelivery.id // Link it here
            });
            
            alert('Gate pass requested for external rider. Delivery will be dispatched upon admin approval.');
        } else {
             addDeliveryRequest({
                requesterId: currentUser.id,
                requesterName: currentUser.name,
                ...formData,
                pickupLat: currentUser.lat,
                pickupLng: currentUser.lng,
                riderId: rider.id, // Assign directly
                riderName: rider.name,
            });
            alert('Request sent to rider!');
        }
        
        onClose();
    };

     return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Request {rider.name}</h3>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <textarea placeholder="Pickup Address" value={formData.pickupAddress} onChange={e => setFormData({...formData, pickupAddress: e.target.value})} className="w-full p-2 border rounded" required rows={2}/>
                     <textarea placeholder="Drop-off Address" value={formData.dropoffAddress} onChange={e => setFormData({...formData, dropoffAddress: e.target.value})} className="w-full p-2 border rounded" required rows={2}/>
                     <textarea placeholder="Delivery Instructions" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded" required rows={3}/>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Cancel</button>
                        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Send Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RequestGatePassModal: React.FC<{
    visitor: User;
    onClose: () => void;
}> = ({ visitor, onClose }) => {
    const { currentUser } = useContext(AuthContext);
    const { addGatePass, addDeliveryRequest, updateGatePass } = useContext(DataContext);
    const [formData, setFormData] = useState({ purpose: '', visitDateTime: '' });
    const [isForDelivery, setIsForDelivery] = useState(false);
    const [deliveryData, setDeliveryData] = useState({ dropoffAddress: '', description: '' });

    if (!currentUser) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.visitDateTime || !formData.purpose) {
            alert("Please fill all fields.");
            return;
        }

        const visitorName = ('businessName' in visitor && visitor.businessName) ? visitor.businessName : visitor.name;

        if (isForDelivery) {
            const newDelivery = addDeliveryRequest({
                requesterId: currentUser.id,
                requesterName: currentUser.name,
                pickupAddress: visitor.address,
                dropoffAddress: deliveryData.dropoffAddress,
                description: deliveryData.description,
                status: DeliveryStatus.AWAITING_GATE_PASS,
                pickupLat: visitor.lat,
                pickupLng: visitor.lng,
            });

            const newGatePass = addGatePass({
                residentId: currentUser.id,
                residentName: currentUser.name,
                visitorName: visitorName,
                visitorType: visitor.role,
                purpose: `Delivery from ${visitorName}: ${deliveryData.description}`,
                visitDateTime: formData.visitDateTime,
                targetVisitorId: visitor.id,
            });
            updateGatePass({ ...newGatePass, linkedDeliveryId: newDelivery.id });
            alert('Gate pass and delivery request submitted for admin approval.');

        } else {
             addGatePass({
                residentId: currentUser.id,
                residentName: currentUser.name,
                visitorName: visitorName,
                visitorType: visitor.role,
                purpose: formData.purpose,
                visitDateTime: formData.visitDateTime,
                targetVisitorId: visitor.id,
            });
            alert('Gate pass request submitted for admin approval.');
        }

       
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Request Gate Pass for {('businessName' in visitor && visitor.businessName) ? visitor.businessName : visitor.name}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="isForDelivery" name="isForDelivery" type="checkbox" checked={isForDelivery} onChange={(e) => setIsForDelivery(e.target.checked)} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isForDelivery" className="font-medium text-gray-700">This gate pass is for a delivery</label>
                        </div>
                    </div>
                    
                    {isForDelivery ? (
                         <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Delivery Instructions</label>
                                <textarea value={deliveryData.description} onChange={e => setDeliveryData({...deliveryData, description: e.target.value})} className="w-full p-2 border rounded mt-1" required rows={3}/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Drop-off Address</label>
                                <textarea value={deliveryData.dropoffAddress} onChange={e => setDeliveryData({...deliveryData, dropoffAddress: e.target.value})} className="w-full p-2 border rounded mt-1" required rows={2}/>
                            </div>
                        </>
                    ) : (
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Purpose of Visit</label>
                            <input type="text" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} className="w-full p-2 border rounded mt-1" required />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date and Time of Visit/Delivery</label>
                        <input type="datetime-local" value={formData.visitDateTime} onChange={e => setFormData({ ...formData, visitDateTime: e.target.value })} className="w-full p-2 border rounded mt-1" required />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Cancel</button>
                        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const DirectoryProfileView: React.FC<{ user: User | null, startChat: (user: User) => void }> = ({ user, startChat }) => {
    const { currentUser } = useContext(AuthContext);
    const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);

    if (!user || !currentUser) return <div>User not found.</div>;

    const showRequestGatePassButton = currentUser.role === Role.RESIDENT &&
        (user.role === Role.STORE || user.role === Role.SERVICE_PROVIDER) &&
        user.operatesOutsideEstate;

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                    <img src={user.photoUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover"/>
                    <div>
                        <h1 className="text-2xl font-bold">{ 'businessName' in user && user.businessName ? user.businessName : user.name}</h1>
                        <p className="text-gray-600 mb-2">{user.role}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p><strong>Contact:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                    {'hoursOfOperation' in user && <p><strong>Hours:</strong> {user.hoursOfOperation}</p>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => startChat(user)} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Chat with { 'businessName' in user && user.businessName ? user.businessName.split(' ')[0] : user.name.split(' ')[0]}</button>
                    {showRequestGatePassButton && (
                        <button onClick={() => setIsGatePassModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold">Request Gate Pass</button>
                    )}
                </div>
            </div>
            {isGatePassModalOpen && (
                <RequestGatePassModal 
                    visitor={user} 
                    onClose={() => setIsGatePassModalOpen(false)} 
                />
            )}
        </>
    )
}

const ChatView: React.FC<{
    activeConversation: Conversation | null;
    setActiveConversation: (conv: Conversation | null) => void;
    startChat: (user: User) => void;
}> = ({ activeConversation, setActiveConversation, startChat }) => {
    const { currentUser } = useContext(AuthContext);
    const { conversations, messages, users, markConversationAsRead } = useContext(DataContext);
    if (!currentUser) return null;

    const myConversations = conversations.filter(c => c.participantIds.includes(currentUser.id));
    
    useEffect(() => {
        if (activeConversation) {
            markConversationAsRead(activeConversation.id, currentUser.id);
        }
    }, [activeConversation, messages, currentUser.id, markConversationAsRead]);

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-white rounded-lg shadow-md">
            {/* Conversation List */}
            <div className={`w-full md:w-1/3 border-r ${activeConversation && 'hidden md:block'}`}>
                <div className="p-4 border-b font-bold text-lg">Conversations</div>
                <div className="overflow-y-auto h-[calc(100%-4rem)]">
                    {myConversations.map(conv => {
                        const otherUserId = conv.participantIds.find(id => id !== currentUser.id);
                        const otherUser = users.find(u => u.id === otherUserId);
                        const unreadCount = messages.filter(m => m.conversationId === conv.id && m.receiverId === currentUser.id && !m.read).length;
                        return (
                             <div key={conv.id} onClick={() => setActiveConversation(conv)} className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 ${activeConversation?.id === conv.id && 'bg-teal-50'}`}>
                                <img src={otherUser?.photoUrl} alt={otherUser?.name} className="h-12 w-12 rounded-full object-cover"/>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">{otherUser?.name}</p>
                                        <p className="text-xs text-gray-500">{formatTime(conv.lastMessage.timestamp)}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage.text}</p>
                                        {unreadCount > 0 && <span className="bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}
                                    </div>
                                </div>
                             </div>
                        )
                    })}
                </div>
            </div>
            
            {/* Message View */}
            <div className={`w-full md:w-2/3 flex flex-col ${!activeConversation && 'hidden md:flex'}`}>
                {activeConversation ? (
                    <MessageView conversation={activeConversation} onBack={() => setActiveConversation(null)} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">Select a conversation to start chatting</div>
                )}
            </div>
        </div>
    )
}

const MessageView: React.FC<{ conversation: Conversation, onBack: () => void }> = ({ conversation, onBack }) => {
    const { currentUser } = useContext(AuthContext);
    const { messages, users, addMessage } = useContext(DataContext);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    if (!currentUser) return null;

    const otherUserId = conversation.participantIds.find(id => id !== currentUser.id);
    if (!otherUserId) return null; // Handle case where other user is not found
    const otherUser = users.find(u => u.id === otherUserId);
    const conversationMessages = messages.filter(m => m.conversationId === conversation.id);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newMessage]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !otherUser) return;
        addMessage({
            conversationId: conversation.id,
            senderId: currentUser.id,
            receiverId: otherUser.id,
            text: newMessage.trim(),
        });
        setNewMessage('');
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    }

    return (
        <>
            <div className="p-4 border-b flex items-center space-x-3">
                <button onClick={onBack} className="md:hidden mr-2 p-1 rounded-full hover:bg-gray-100"> &lt; </button>
                <img src={otherUser?.photoUrl} alt={otherUser?.name} className="h-10 w-10 rounded-full object-cover"/>
                <span className="font-semibold">{otherUser?.name}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {conversationMessages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const lastMessage = conversationMessages[index-1];
                    const showTimestamp = !lastMessage || new Date(msg.timestamp).getTime() - new Date(lastMessage.timestamp).getTime() > 60000 * 5;

                    return (
                        <React.Fragment key={msg.id}>
                            {showTimestamp && <p className="text-center text-xs text-gray-500 my-2">{new Date(msg.timestamp).toLocaleDateString()}</p>}
                            <div className={`flex items-end space-x-2 ${isMe ? 'justify-end' : ''}`}>
                                <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${isMe ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>
                                    <p>{msg.text}</p>
                                    <div className="flex items-center justify-end mt-1 space-x-1">
                                        <p className={`text-xs ${isMe ? 'text-teal-200' : 'text-gray-500'}`}>{formatTime(msg.timestamp)}</p>
                                        {isMe && (
                                           msg.read ? <ReadReceiptIcon className="h-4 w-4 text-green-300" /> : <CheckCircleIcon className="h-4 w-4 text-teal-200" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )
                })}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex items-center bg-gray-100 rounded-lg p-2">
                    <textarea 
                        ref={textareaRef}
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none"
                        rows={1}
                    />
                    <button type="submit" className="p-2 text-brand-primary hover:bg-gray-200 rounded-full">
                        <SendIcon className="h-6 w-6" />
                    </button>
                </div>
            </form>
        </>
    );
};

const ProfileView = () => {
    const { currentUser } = useContext(AuthContext);
    const { updateUser } = useContext(DataContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(currentUser);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    if (!currentUser || !formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
                 setFormData({ ...formData, photoUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    }
    
    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
        setPhotoPreview(null);
    }

    const handleToggleAvailability = () => {
        if (formData.role === Role.DISPATCH_RIDER) {
            const newStatus = !('isOnline' in formData && formData.isOnline);
            const updatedUser = { ...formData, isOnline: newStatus };
            setFormData(updatedUser);
            updateUser(updatedUser);
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">My Profile</h1>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Edit Profile</button>}
            </div>

            {isEditing ? (
                 <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={photoPreview || formData.photoUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover"/>
                        <input type="file" onChange={handleFileChange} className="text-sm" />
                    </div>
                     <input name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" />
                     <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-2 border rounded" />
                     <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border rounded" />
                     <div className="flex space-x-2">
                         <button onClick={handleSave} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold">Save Changes</button>
                         <button onClick={() => { setIsEditing(false); setPhotoPreview(null); setFormData(currentUser); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Cancel</button>
                     </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img src={currentUser.photoUrl} alt={currentUser.name} className="h-20 w-20 rounded-full object-cover"/>
                        <div>
                            <p className="text-xl font-bold">{currentUser.name}</p>
                            <p className="text-gray-600">{currentUser.role}</p>
                        </div>
                    </div>
                     <p><strong>Email:</strong> {currentUser.email}</p>
                     <p><strong>Phone:</strong> {currentUser.phone}</p>
                     <p><strong>Address:</strong> {currentUser.address}</p>
                     
                     {currentUser.role === Role.DISPATCH_RIDER && 'isOnline' in currentUser && (
                        <div className="flex items-center space-x-3">
                            <label className="font-semibold">Availability:</label>
                            <button onClick={handleToggleAvailability} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${currentUser.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${currentUser.isOnline ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                            <span className={`font-semibold ${currentUser.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                                {currentUser.isOnline ? 'Online' : 'Offline'}
                            </span>
                        </div>
                     )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;