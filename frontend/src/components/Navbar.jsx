import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, AlertTriangle, BarChart3, Settings, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/alerts', label: 'Alerts', icon: <AlertTriangle size={18} /> },
        { to: '/metrics', label: 'System Metrics', icon: <BarChart3 size={18} /> },
        { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-2 font-bold text-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                        <Shield size={18} />
                    </div>
                    <span className="hidden sm:inline-block">CYBER-RESILIENT</span>
                </div>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-white/5 ${isActive ? 'bg-white/5 text-primary' : 'text-gray-400'
                                }`
                            }
                        >
                            {item.icon}
                            <span className="hidden md:inline-block">{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 lg:flex">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-semibold text-white">{user?.name}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.role}</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg p-2 text-gray-400 hover:bg-danger/10 hover:text-danger transition-all"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
