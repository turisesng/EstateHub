import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { DeliveryIcon, GatePassIcon, UsersIcon, DocumentTextIcon, CheckCircleIcon } from '../components/icons';

interface LoginProps {
    onNavigateToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigateToSignUp }) => {
    const { login } = useContext(AuthContext);

    const handleQuickLogin = (email: string) => {
        login(email);
    };

    const handleScrollToLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const loginSection = document.getElementById('login');
        if (loginSection) {
            loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const HeroIllustration = () => (
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="0" y="0" width="512" height="512" fill="#F0FDFA" {...{rx:"30"}}></rect>
            <path d="M432,448 H80 c-17.67,0-32-14.33-32-32 V224 c0-17.67,14.33-32,32-32 h352 c17.67,0,32,14.33,32,32 v192 C464,433.67,449.67,448,432,448z" fill="#E0F2F1"/>
            <path d="M128,192 v-32 c0-35.35,28.65-64,64-64 h128 c35.35,0,64,28.65,64,64 v32" fill="none" stroke="#0D9488" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="160" y="240" width="192" height="208" fill="#FFFFFF" {...{rx:"16"}}/>
            <rect x="192" y="272" width="128" height="80" fill="#A7F3D0" {...{rx:"8"}}/>
            <circle cx="256" cy="384" r="24" fill="#0D9488"/>
            <path d="M256, 408 v40" stroke="#0D9488" strokeWidth="12" strokeLinecap="round"/>
            <path d="M64,288 H32" stroke="#0D9488" strokeWidth="16" strokeLinecap="round"/>
            <path d="M480,288 h-32" stroke="#0D9488" strokeWidth="16" strokeLinecap="round"/>
            <path d="M96,448 V320" stroke="#A7F3D0" strokeWidth="16" strokeLinecap="round"/>
            <path d="M416,448 V320" stroke="#A7F3D0" strokeWidth="16" strokeLinecap="round"/>
            <path d="M256,64 a48,48 0 0,1 48,48" fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
            <path d="M160,192 a96,96 0 0,1 96,-96" fill="none" stroke="#3B82F6" strokeWidth="12" strokeLinecap="round" strokeDasharray="10 20"/>
        </svg>
    );

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
        <div className="min-h-screen bg-white text-brand-dark">
            {/* Header */}
            <header className="p-4 md:px-8 border-b sticky top-0 bg-white/90 backdrop-blur-sm z-20">
                <div className="container mx-auto flex justify-between items-center">
                    {/* Left-justified logo and brand name */}
                    <div className="flex items-center space-x-2">
                        <Logo />
                        <span className="text-2xl font-bold text-brand-primary">EstateHub</span>
                    </div>
                    
                    {/* Right-justified CTAs */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <a href="#login" onClick={handleScrollToLogin} className="font-semibold text-gray-700 hover:text-brand-primary transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">
                            Log In
                        </a>
                        <button 
                            onClick={onNavigateToSignUp} 
                            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-sm"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24 px-4 md:px-8">
                <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-tight mb-4">
                            Your Estate, <span className="text-brand-primary">Simplified.</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                            The all-in-one platform for seamless deliveries, secure gate access, and effortless service management within your housing estate.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                            <button onClick={onNavigateToSignUp} className="inline-block bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                                Get Started
                            </button>
                             <a href="#login" onClick={handleScrollToLogin} className="font-semibold text-brand-primary hover:underline">
                                Or Log In
                            </a>
                        </div>
                    </div>
                    <div className="max-w-md mx-auto md:max-w-full">
                       <HeroIllustration />
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-16 md:py-20 bg-gray-50 px-4 md:px-8">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything Your Estate Needs</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">From requesting a dispatch rider to approving a visitor's gate pass, EstateHub brings all your estate's needs into one user-friendly app.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <DeliveryIcon className="h-12 w-12 mx-auto text-brand-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Effortless Deliveries</h3>
                            <p className="text-gray-600">Request pickups, deliveries, or errands from trusted riders within and outside your estate.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <GatePassIcon className="h-12 w-12 mx-auto text-brand-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Secure Gate Access</h3>
                            <p className="text-gray-600">Generate and manage digital gate passes for visitors, service providers, and deliveries with ease.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <UsersIcon className="h-12 w-12 mx-auto text-brand-primary mb-4" />
                            <h3 className="text-xl font-bold mb-2">Community Connect</h3>
                            <p className="text-gray-600">Stay informed with estate-wide announcements and connect with registered service providers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Onboarding Section */}
            <section className="py-16 md:py-20 px-4 md:px-8 bg-white">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Easy Steps</h2>
                    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">Joining our community is quick, simple, and secure. Follow these steps to get full access to EstateHub.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
                        <div className="relative p-8 rounded-xl border border-gray-200">
                           <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 bg-teal-100 text-brand-primary p-3 rounded-full">
                                    <UsersIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Sign Up</h3>
                                    <p className="text-gray-500 text-sm">Step 1</p>
                                </div>
                           </div>
                           <p className="mt-4 text-gray-600">Choose your role—Resident, Rider, Store, or Service Provider—and fill out our simple registration form with your details.</p>
                        </div>
                        <div className="relative p-8 rounded-xl border border-gray-200">
                           <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 bg-teal-100 text-brand-primary p-3 rounded-full">
                                    <DocumentTextIcon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Upload Documents</h3>
                                     <p className="text-gray-500 text-sm">Step 2</p>
                                </div>
                           </div>
                           <p className="mt-4 text-gray-600">For security and verification, upload the required documents based on your role, such as proof of address or vehicle ownership.</p>
                        </div>
                        <div className="relative p-8 rounded-xl border border-gray-200">
                           <div className="flex items-center space-x-4">
                               <div className="flex-shrink-0 bg-teal-100 text-brand-primary p-3 rounded-full">
                                    <CheckCircleIcon className="h-7 w-7" />
                               </div>
                               <div>
                                    <h3 className="text-xl font-bold">Get Approved</h3>
                                    <p className="text-gray-500 text-sm">Step 3</p>
                               </div>
                           </div>
                           <p className="mt-4 text-gray-600">Our estate admin will review your application. Once approved, you'll receive full access to all EstateHub features!</p>
                        </div>
                    </div>
                     <div className="mt-12">
                        <button onClick={onNavigateToSignUp} className="inline-block bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">
                           Create an Account Now
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Access / Login Section */}
            <section id="login" className="py-16 md:py-20 px-4 md:px-8 bg-gray-50">
                <div className="container mx-auto text-center max-w-3xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access Demo</h2>
                    <p className="text-gray-600 mb-10">For demonstration purposes, please select a role to enter the application. New users should create an account first.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button onClick={() => handleQuickLogin('chinedu@email.com')} className="bg-white text-brand-primary font-bold py-4 px-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">Resident</button>
                        <button onClick={() => handleQuickLogin('musa@rider.com')} className="bg-white text-brand-primary font-bold py-4 px-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">Rider</button>
                        <button onClick={() => handleQuickLogin('mama.chi@store.com')} className="bg-white text-brand-primary font-bold py-4 px-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">Store</button>
                        <button onClick={() => handleQuickLogin('fixit@services.com')} className="bg-white text-brand-primary font-bold py-4 px-2 rounded-lg shadow-md hover:shadow-lg border border-gray-200 hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1">Service Provider</button>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button onClick={() => handleQuickLogin('admin@estate.com')} className="w-full md:w-1/2 bg-brand-dark text-white font-bold py-4 px-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1">Estate Admin</button>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="bg-gray-100 border-t mt-12">
                <div className="container mx-auto py-6 px-4 md:px-8 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} EstateHub. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Login;