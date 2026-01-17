import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Globe, ArrowRight, ShieldCheck, Activity, Cpu } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary/30 overflow-x-hidden">
            {/* Background Ornaments */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <Shield size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            CYBER-RESILIENT
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-24 pb-20 px-6 overflow-hidden">
                <div className="mx-auto max-w-7xl text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Next-Gen Infrastructure Defense
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                        Resilience Powered by <br />
                        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent italic">
                            AI Intelligence
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
                        A state-of-the-art cybersecurity platform designed to protect critical infrastructure
                        using real-time anomaly detection, automated response, and deep hardware monitoring.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 group"
                        >
                            Protect Your Systems <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-8 py-4 text-lg font-bold hover:bg-white/10 transition-all"
                        >
                            View Dashboard
                        </Link>
                    </div>
                </div>

                {/* Mockup Preview */}
                <div className="mt-24 mx-auto max-w-5xl relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-[3rem] -z-10 animate-pulse" />
                    <div className="glass rounded-[2rem] border border-white/10 p-2 shadow-2xl overflow-hidden aspect-video">
                        <div className="bg-black/40 w-full h-full rounded-[1.5rem] flex items-center justify-center text-gray-600 font-mono text-sm uppercase tracking-[0.2em]">
                            {/* Simulated Content */}
                            <div className="grid grid-cols-4 gap-8 w-full p-12">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                                <div className="col-span-3 h-64 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
                                <div className="h-64 bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section className="py-24 px-6 relative">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16">
                        <h2 className="text-4xl font-bold mb-4">Core Capabilities</h2>
                        <div className="h-1.5 w-24 bg-primary rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Anomaly Detection',
                                desc: 'Real-time ML analysis identifies irregular patterns across Healthcare, Agriculture, and Urban sectors.',
                                icon: <Activity className="text-primary" size={28} />
                            },
                            {
                                title: 'Infrastructure Health',
                                desc: 'Deep hardware monitoring for CPU, Memory, and Network I/O providing full system visibility.',
                                icon: <Cpu className="text-accent" size={28} />
                            },
                            {
                                title: 'Rapid Response',
                                desc: 'Automated mitigation strategies to isolate threats before they compromise critical endpoints.',
                                icon: <Zap className="text-warning" size={28} />
                            }
                        ].map((f, i) => (
                            <div key={i} className="glass p-10 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all card-hover group">
                                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6">
                <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <Shield size={24} className="text-primary" />
                        <span className="font-bold">CYBER-RESILIENT</span>
                    </div>
                    <p className="text-gray-500 text-sm">© 2026 Cyber-Resilient Infrastructure Platform. All rights reserved.</p>
                    <div className="flex gap-6 text-gray-500 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
