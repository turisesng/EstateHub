import React, { useState, useContext } from 'react';
import { DataContext } from '../App';
import { Role, VehicleType } from '../types';

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
    const { addUser } = useContext(DataContext);
    const [role, setRole] = useState<Role>(Role.RESIDENT);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        operatesOutsideEstate: false,
        businessName: '',
        vehicleLicencePlate: '',
        vehicleType: VehicleType.MOTORCYCLE,
    });
    const [files, setFiles] = useState<{[key: string]: File | null}>({});

    // FIX: Correctly handle change events from various input elements.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;

        // Use a type guard to check if the element is a checkbox.
        // If so, use its `checked` property for the value. Otherwise, use `value`.
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: target.value }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileKey: string) => {
        if (e.target.files && e.target.files[0]) {
           setFiles(prev => ({...prev, [fileKey]: e.target.files![0]}));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userPayload: any = { ...formData, role };
        
        // Create placeholder URLs for all uploaded files for demo purposes
        for (const key in files) {
            if(files[key]){
                userPayload[`${key}Url`] = URL.createObjectURL(files[key]!);
            }
        }
        // Special case for photo/logo
        if (files.photo) {
             userPayload.photoUrl = URL.createObjectURL(files.photo);
        }

        addUser(userPayload);
        alert('Registration successful! Your account is now awaiting admin approval.');
        onNavigateToLogin();
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
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                                <input id="businessName" name="businessName" type="text" required onChange={handleInputChange} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" />
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
                                    <label htmlFor="vehicleLicencePlate" className="block text-sm font-medium text-gray-700">Vehicle Licence Plate No.</label>
                                    <input id="vehicleLicencePlate" name="vehicleLicencePlate" type="text" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Type of Vehicle</label>
                                    <select id="vehicleType" name="vehicleType" required onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                                        {Object.values(VehicleType).map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {[Role.DISPATCH_RIDER, Role.STORE, Role.SERVICE_PROVIDER].includes(role) && (
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="operatesOutsideEstate" name="operatesOutsideEstate" type="checkbox" onChange={handleInputChange} className="focus:ring-brand-primary h-4 w-4 text-brand-primary border-gray-300 rounded" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="operatesOutsideEstate" className="font-medium text-gray-700">I operate from outside the estate</label>
                                </div>
                            </div>
                        )}

                        {/* File Uploads */}
                        <div className="space-y-4 border-t pt-6">
                             <h3 className="text-lg font-medium text-gray-900">Verification Documents</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FileInput label={role === Role.STORE ? 'Business Logo' : 'Profile Photo'} id="photo" required onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" />
                               
                               {/* Resident Uploads */}
                               {role === Role.RESIDENT && <>
                                   <FileInput label="Means of Identification" id="meansOfId" required onChange={(e) => handleFileChange(e, 'meansOfId')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Address" id="proofOfAddress" required onChange={(e) => handleFileChange(e, 'proofOfAddress')} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}
                               
                               {/* Rider Uploads */}
                               {role === Role.DISPATCH_RIDER && <>
                                   <FileInput label="Driver's Licence" id="driverLicence" required onChange={(e) => handleFileChange(e, 'driverLicence')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Vehicle Ownership" id="vehicleOwnership" required onChange={(e) => handleFileChange(e, 'vehicleOwnership')} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}

                               {/* Store Uploads */}
                               {role === Role.STORE && <>
                                   <FileInput label="Certificate of Incorporation" id="incorporationCert" required onChange={(e) => handleFileChange(e, 'incorporationCert')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Owner's Means of ID" id="meansOfId" required onChange={(e) => handleFileChange(e, 'meansOfId')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Business Address" id="storeOwnership" required onChange={(e) => handleFileChange(e, 'storeOwnership')} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}

                               {/* Service Provider Uploads */}
                               {role === Role.SERVICE_PROVIDER && <>
                                   <FileInput label="Trade/Skill Licence" id="tradeLicence" required onChange={(e) => handleFileChange(e, 'tradeLicence')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Means of Identification" id="meansOfId" required onChange={(e) => handleFileChange(e, 'meansOfId')} accept=".pdf,.jpg,.jpeg,.png" />
                                   <FileInput label="Proof of Residence" id="residenceProof" required onChange={(e) => handleFileChange(e, 'residenceProof')} accept=".pdf,.jpg,.jpeg,.png" />
                               </>}
                            </div>
                        </div>


                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;