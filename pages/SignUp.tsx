import React, { useState } from 'react';
import { supabase } from '../App';
import { Role, VehicleType, ApprovalStatus } from '../types';

interface SignUpProps {
    onNavigateToLogin: () => void;
}

const FileInput: React.FC<{ label: string; id: string; required?: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; accept: string;}> = ({ label, id, required, onChange, accept }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input id={id} name={id} type="file" required={required} onChange={onChange} accept={accept} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-brand-primary hover:file:bg-teal-100" />
    </div>
);


const SignUp: React.FC<SignUpProps> = ({ onNavigateToLogin }) => {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<Role>(Role.RESIDENT);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        operates_outside_estate: false,
        business_name: '',
        vehicle_licence_plate: '',
        vehicle_type: VehicleType.MOTORCYCLE,
    });
    const [files, setFiles] = useState<{[key: string]: File | null}>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
           setFiles(prev => ({...prev, [e.target.name]: e.target.files![0]}));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError || !authData.user) {
            alert('Error signing up: ' + authError?.message);
            setLoading(false);
            return;
        }
        
        const user = authData.user;
        
        // Start with common fields for all users
        const userPayload: any = {
            id: user.id,
            email: user.email,
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            role,
            approval_status: ApprovalStatus.PENDING,
            lat: 6.5244 + (Math.random() - 0.5) * 0.01,
            lng: 3.3792 + (Math.random() - 0.5) * 0.01,
        };
    
        // Add role-specific fields
        switch (role) {
            case Role.STORE:
                userPayload.business_name = formData.business_name;
                userPayload.operates_outside_estate = formData.operates_outside_estate;
                break;
            case Role.DISPATCH_RIDER:
                userPayload.vehicle_licence_plate = formData.vehicle_licence_plate;
                userPayload.vehicle_type = formData.vehicle_type;
                userPayload.operates_outside_estate = formData.operates_outside_estate;
                break;
            case Role.SERVICE_PROVIDER:
                userPayload.operates_outside_estate = formData.operates_outside_estate;
                break;
            case Role.RESIDENT:
                userPayload.operates_outside_estate = false;
                break;
        }

        for (const key in files) {
            const file = files[key];
            if (file) {
                const filePath = `${user.id}/${key}_${file.name}`;
                const { error: uploadError } = await supabase.storage.from('user_assets').upload(filePath, file);
                if (uploadError) {
                    console.error(`Error uploading ${key}:`, uploadError);
                } else {
                    const { data: { publicUrl } } = supabase.storage.from('user_assets').getPublicUrl(filePath);
                    userPayload[`${key}_url`] = publicUrl;
                }
            }
        }
        
        const { error: profileError } = await supabase.from('profiles').insert(userPayload);

        if (profileError) {
            alert('Error creating profile: ' + profileError.message);
        } else {
            alert('Registration successful! Please check your email to verify your account. Your account will then be reviewed by an admin.');
            onNavigateToLogin();
        }
        setLoading(false);
    };

    const Logo = () => (
        <svg
            className="w-10 h-10 text-brand-primary"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M12 2.25L5 8.25V11c0 3.87 3.13 7 7 7s7-3.13 7-7V8.25L12 2.25zm0 13.5c-2.76 0-5-2.24-5-5V9.42l5-3.57 5 3.57V11c0 2.76-2.24 5-5 5z" opacity="0.6"/>
            <path d="M12 7a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                 <div className="flex items-center justify-center space-x-2">
                    <Logo />
                    <span className="text-3xl font-bold text-brand-primary">EstateHub</span>
                </div>
                <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                    Create your new account
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Or{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-brand-primary hover:text-brand-secondary">
                        sign in to your existing account
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">I am a...</label>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                {[Role.RESIDENT, Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER].map(r => (
                                    <button
                                        type="button"
                                        key={r}
                                        onClick={() => setRole(r)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${role === r ? 'bg-brand-primary text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {role === Role.STORE && (
                             <div>
                                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Business Name</label>
                                <input id="business_name" name="business_name" type="text" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                {role === Role.STORE ? "Owner's Full Name" : "Full Name"}
                            </label>
                            <input id="name" name="name" type="text" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input id="email" name="email" type="email" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input id="phone" name="phone" type="tel" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">{role === Role.STORE ? "Business Address" : "Full Address"}</label>
                            <textarea id="address" name="address" required onChange={handleInputChange} rows={2} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                        </div>
                        
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
                        </div>

                        {role === Role.DISPATCH_RIDER && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="vehicle_licence_plate" className="block text-sm font-medium text-gray-700">Vehicle Licence Plate No.</label>
                                    <input id="vehicle_licence_plate" name="vehicle_licence_plate" type="text" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700">Type of Vehicle</label>
                                    <select id="vehicle_type" name="vehicle_type" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                                        {Object.values(VehicleType).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {[Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER].includes(role) && (
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="operates_outside_estate" name="operates_outside_estate" type="checkbox" onChange={handleInputChange} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="operates_outside_estate" className="font-medium text-gray-700">I operate from outside the estate</label>
                                </div>
                            </div>
                        )}

                        {/* File Uploads */}
                        <div className="space-y-4 border-t pt-6">
                             <h3 className="text-lg font-medium text-gray-900">Verification Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FileInput label={role === Role.STORE ? 'Business Logo' : 'Profile Photo'} id="photo" required onChange={handleFileChange} accept="image/*" />
                               
                               {/* Resident Uploads */}
                               {role === Role.RESIDENT && <>
                                   <FileInput label="Means of Identification" id="means_of_id" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Address" id="proof_of_address" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}
                               
                               {/* Rider Uploads */}
                               {role === Role.DISPATCH_RIDER && <>
                                   <FileInput label="Driver's Licence" id="driver_licence" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Vehicle Ownership" id="vehicle_ownership" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}

                               {/* Store Uploads */}
                               {role === Role.STORE && <>
                                   <FileInput label="Certificate of Incorporation" id="incorporation_cert" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Owner's Means of ID" id="means_of_id" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Business Address" id="store_ownership" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}

                               {/* Service Provider Uploads */}
                               {role === Role.SERVICE_PROVIDER && <>
                                   <FileInput label="Trade/Skill Licence" id="trade_licence" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Means of Identification" id="means_of_id" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Residence" id="residence_proof" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}
                            </div>
                        </div>


                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;