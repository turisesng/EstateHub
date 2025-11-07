import React, { useContext, useState } from 'react';
import { AuthContext, DataContext } from '../App';
import { User, ApprovalStatus, Role, DeliveryStatus, GatePass, GatePassStatus, DeliveryRequest } from '../types';
import { HomeIcon, UsersIcon, LogoutIcon, AnnouncementIcon, AnalyticsIcon, CheckCircleIcon, XCircleIcon, EyeIcon, DeliveryIcon, GatePassIcon } from '../components/icons';

// Main Admin Dashboard Component
const AdminDashboard: React.FC = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('dashboard');
    if (!currentUser) return <div>Loading...</div>;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
        { id: 'users', label: 'User Management', icon: UsersIcon },
        { id: 'deliveries', label: 'Delivery Monitoring', icon: DeliveryIcon },
        { id: 'gatepass', label: 'Gate Pass Mgt', icon: GatePassIcon },
        { id: 'announcements', label: 'Announcements', icon: AnnouncementIcon },
        { id: 'analytics', label: 'Analytics', icon: AnalyticsIcon },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardView />;
            case 'users': return <UserManagement />;
            case 'deliveries': return <DeliveryMonitoring />;
            case 'gatepass': return <GatePassManagement />;
            default: return <DashboardView />;
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-brand-dark text-white flex flex-col h-screen">
                <div className="p-4 border-b border-gray-700 flex items-center justify-center">
                    <h1 className="text-2xl font-bold">EstateHub Admin</h1>
                </div>
                 <div className="p-4 flex flex-col items-center border-b border-gray-700">
                    <img src={currentUser.photo_url} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover" />
                    <h2 className="mt-2 font-semibold">{currentUser.name}</h2>
                    <p className="text-sm text-gray-400">Estate Admin</p>
                </div>
                <nav className="flex-grow p-2">
                    {navItems.map(item => (
                         <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-left ${activeTab === item.id ? 'bg-brand-secondary text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-2 border-t border-gray-700">
                    <button onClick={logout} className="w-full flex items-center p-3 rounded-lg hover:bg-gray-700 text-left">
                        <LogoutIcon className="h-5 w-5 mr-3" /> Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// Admin View Components
const DashboardView = () => {
    const { users, deliveryRequests, gatePasses } = useContext(DataContext);
    const pendingUsers = users.filter(u => u.approval_status === ApprovalStatus.PENDING).length;
    const activeDeliveries = deliveryRequests.filter(d => d.status === DeliveryStatus.IN_TRANSIT || d.status === DeliveryStatus.ACCEPTED).length;
    const pendingGatePasses = gatePasses.filter(g => g.status === GatePassStatus.PENDING).length;
    const onlineRiders = users.filter(u => u.role === Role.DISPATCH_RIDER && u.is_online).length;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow"><h4 className="font-bold text-gray-800">Pending Approvals</h4><p className="text-3xl font-bold text-yellow-500">{pendingUsers}</p></div>
            <div className="bg-white p-6 rounded-lg shadow"><h4 className="font-bold text-gray-800">Active Deliveries</h4><p className="text-3xl font-bold text-blue-500">{activeDeliveries}</p></div>
            <div className="bg-white p-6 rounded-lg shadow"><h4 className="font-bold text-gray-800">Pending Gate Passes</h4><p className="text-3xl font-bold text-indigo-500">{pendingGatePasses}</p></div>
            <div className="bg-white p-6 rounded-lg shadow"><h4 className="font-bold text-gray-800">Online Riders</h4><p className="text-3xl font-bold text-green-500">{onlineRiders}</p></div>
        </div>
    );
}

const UserManagement = () => {
    const { users, updateUser } = useContext(DataContext);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleApproval = (user: User, status: ApprovalStatus) => {
        updateUser({ ...user, approval_status: status });
    };

    if (!users) return <div>Loading users...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">All Users</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Role</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Availability</th>
                            <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4">{user.role}</td>
                                <td className="py-3 px-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.approval_status === ApprovalStatus.APPROVED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{user.approval_status}</span></td>
                                <td className="py-3 px-4">
                                    {user.role === Role.DISPATCH_RIDER && (
                                        <span className={`flex items-center space-x-2 text-sm ${user.is_online ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className={`h-2 w-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            <span>{user.is_online ? 'Online' : 'Offline'}</span>
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 flex items-center space-x-2">
                                    {user.approval_status === ApprovalStatus.PENDING && (
                                        <>
                                            <button onClick={() => handleApproval(user, ApprovalStatus.APPROVED)} className="text-green-500 hover:text-green-700" title="Approve"><CheckCircleIcon className="h-6 w-6" /></button>
                                            <button onClick={() => handleApproval(user, ApprovalStatus.SUSPENDED)} className="text-red-500 hover:text-red-700" title="Suspend"><XCircleIcon className="h-6 w-6" /></button>
                                        </>
                                    )}
                                    <button onClick={() => setSelectedUser(user)} className="text-blue-500 hover:text-blue-700" title="View Details"><EyeIcon className="h-6 w-6" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
        </div>
    );
};

const UserDetailsModal: React.FC<{ user: User, onClose: () => void }> = ({ user, onClose }) => {
    const documents = [
        { label: "Means of ID", url: user.means_of_id_url },
        { label: "Proof of Address", url: user.proof_of_address_url },
        { label: "Driver's Licence", url: user.driver_licence_url },
        { label: "Vehicle Ownership", url: user.vehicle_ownership_url },
        { label: "Store Ownership", url: user.store_ownership_url },
        { label: "Incorporation Cert", url: user.incorporation_cert_url },
        { label: "Trade Licence", url: user.trade_licence_url },
        { label: "Proof of Residence", url: user.residence_proof_url },
    ].filter(doc => doc.url);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full max-h-full overflow-y-auto">
                <h3 className="text-2xl font-bold mb-4">{user.name}'s Details</h3>
                <div className="space-y-3">
                    {/* Role Specific Details */}
                     {user.business_name && <p><strong>Business:</strong> {user.business_name}</p>}
                     {user.vehicle_type && <p><strong>Vehicle:</strong> {user.vehicle_type} ({user.vehicle_licence_plate})</p>}
                    <p><strong>Documents:</strong></p>
                    <ul className="list-disc list-inside bg-gray-50 p-3 rounded-md">
                        {documents.map(doc => (
                           <li key={doc.label}><a href={doc.url!} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.label}</a></li>
                        ))}
                    </ul>
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg">Close</button>
                </div>
            </div>
        </div>
    );
};

const DeliveryMonitoring = () => {
    const { deliveryRequests } = useContext(DataContext);
    const [filter, setFilter] = useState<DeliveryStatus | 'All'>('All');
    
    if (!deliveryRequests) return <div>Loading deliveries...</div>;

    const filteredDeliveries = filter === 'All' ? deliveryRequests : deliveryRequests.filter(d => d.status === filter);
    const statuses: (DeliveryStatus | 'All')[] = ['All', ...Object.values(DeliveryStatus)];

    return (
         <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">All Deliveries</h3>
            <div className="flex space-x-2 mb-4">
                {statuses.map(s => (
                    <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 text-sm font-semibold rounded-full ${filter === s ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-700'}`}>{s}</button>
                ))}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Requester</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Rider</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {filteredDeliveries.map(req => (
                            <tr key={req.id}>
                                <td className="py-3 px-4">{req.description}</td>
                                <td className="py-3 px-4">{req.requester_name}</td>
                                <td className="py-3 px-4">{req.rider_name || 'N/A'}</td>
                                <td className="py-3 px-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

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

const GatePassManagement = () => {
    const { gatePasses, updateGatePass } = useContext(DataContext);
    
    if (!gatePasses) return <div>Loading gate passes...</div>;

    const pendingPasses = gatePasses.filter(gp => gp.status === GatePassStatus.PENDING);
    
    const handleUpdateStatus = (gp: GatePass, status: GatePassStatus) => {
        updateGatePass({ ...gp, status });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Pending Gate Pass Requests</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                     <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Visitor</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Resident</th>
                             <th className="text-left py-3 px-4 font-semibold text-sm">Purpose</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {pendingPasses.map(gp => (
                            <tr key={gp.id}>
                                <td className="py-3 px-4">{gp.visitor_name} ({gp.visitor_type})</td>
                                <td className="py-3 px-4">{gp.resident_name}</td>
                                <td className="py-3 px-4">{gp.purpose}</td>
                                <td className="py-3 px-4 flex items-center space-x-2">
                                    <button onClick={() => handleUpdateStatus(gp, GatePassStatus.APPROVED)} className="text-green-500 hover:text-green-700" title="Approve"><CheckCircleIcon className="h-6 w-6" /></button>
                                    <button onClick={() => handleUpdateStatus(gp, GatePassStatus.DECLINED)} className="text-red-500 hover:text-red-700" title="Decline"><XCircleIcon className="h-6 w-6" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;