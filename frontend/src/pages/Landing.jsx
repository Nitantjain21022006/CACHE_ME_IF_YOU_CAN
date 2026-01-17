import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Lock, Globe, ArrowRight, ShieldCheck, Activity, Cpu, Database, Network } from 'lucide-react';

const Landing = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = '#00f3ff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
            ctx.lineWidth = 1;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('resize', handleResize);
        init();
        animate();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-[#020204] text-white selection:bg-[#00f3ff]/30 overflow-x-hidden relative cyber-grid">
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
            <div className="cyber-scanline pointer-events-none" />

            {/* Navigation */}
            <nav className="relative z-50 border-b border-[#00f3ff]/10 bg-black/40 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00f3ff]/10 text-[#00f3ff] border border-[#00f3ff]/20 shadow-[0_0_15px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all duration-500">
                            <Shield size={28} className="animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-[0.15em] text-white neon-text-blue">
                                CYBER-RESILIENT
                            </span>
                            <span className="text-[10px] font-bold text-[#00f3ff]/60 tracking-[0.3em] uppercase -mt-1">
                                INFRASTRUCTURE DEFENSE
                            </span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Systems', 'Defense', 'Network', 'Audit'].map((item) => (
                            <a key={item} href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#00f3ff] transition-all hover:translate-y-[-2px]">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-[#00f3ff] hover:text-white transition-all">
                            Access Portal
                        </Link>
                        <Link
                            to="/register"
                            className="relative group overflow-hidden rounded-lg bg-[#00f3ff] px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] active:scale-95"
                        >
                            <span className="relative z-10">Initialize</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-32 px-6 overflow-hidden z-10">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-md border border-[#00f3ff]/30 bg-[#00f3ff]/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00f3ff] mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39ff14]"></span>
                            </span>
                            Sector Monitoring Active
                        </div>

                        <h1 className="text-7xl md:text-[120px] font-black tracking-tighter mb-4 leading-[0.85] text-white animate-in zoom-in-95 duration-1000">
                            FIGHT <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(0,243,255,0.3)' }}>THE</span> <br />
                            <span className="text-[#00f3ff] neon-text-blue animate-glitch">INVISIBLE</span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg text-gray-400 font-medium leading-relaxed animate-in fade-in duration-1000 delay-300">
                            Autonomous defense framework for critical infrastructure.
                            Leveraging deep neural networks to safeguard
                            <span className="text-white px-2">Healthcare</span>,
                            <span className="text-white px-2">Agriculture</span>,
                            and <span className="text-white px-2">Urban Grids</span>.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
                            <Link
                                to="/register"
                                className="flex items-center gap-4 rounded-xl bg-[#00f3ff] px-10 py-5 text-sm font-black uppercase tracking-widest text-black shadow-2xl shadow-[#00f3ff]/20 hover:scale-105 transition-all group active:scale-95"
                            >
                                Build Resilience <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all border-b-2 border-b-[#00f3ff]/50"
                            >
                                Dashboard Alpha
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tech Visuals */}
                <div className="mt-32 mx-auto max-w-6xl relative px-4 flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#00f3ff]/5 blur-[150px] rounded-full -z-10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full opacity-80">
                        {[
                            { label: 'Network Latency', value: '14.2ms', color: 'text-[#00f3ff]' },
                            { label: 'Threat Mitigation', value: '99.9%', color: 'text-[#39ff14]' },
                            { label: 'Sensor Overrides', value: '0 Active', color: 'text-[#ff003c]' },
                        ].map((item, i) => (
                            <div key={i} className="glass p-8 rounded-3xl border border-white/5 flex flex-col items-center space-y-2 card-hover">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{item.label}</span>
                                <span className={`text-4xl font-black ${item.color} leading-none tracking-tighter`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Features (Cyber Update) */}
            <section className="py-32 px-6 relative z-10 bg-black/40">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div>
                            <span className="text-[#00f3ff] font-black text-xs uppercase tracking-[0.4em] mb-4 block">Defense Layers</span>
                            <h2 className="text-5xl font-black text-white">Advanced Core Capabilities</h2>
                        </div>
                        <div className="h-0.5 flex-1 bg-gradient-to-r from-[#00f3ff]/40 to-transparent hidden md:block mb-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Neural Anomaly Engine',
                                desc: 'Proprietary ML models trained on industrial sensor data identify sub-second irregularities.',
                                icon: <Database className="text-[#00f3ff]" size={32} />
                            },
                            {
                                title: 'Infrastructure Hardening',
                                desc: 'Deep kernel-level monitoring for CPU, RAM and I/O pipelines across distributed networks.',
                                icon: <Network className="text-[#39ff14]" size={32} />
                            },
                            {
                                title: 'Autonomous Lockdown',
                                desc: 'AI-driven circuit breaking and IP isolation protocols that engage within milliseconds of detection.',
                                icon: <ShieldCheck className="text-[#bc13fe]" size={32} />
                            }
                        ].map((f, i) => (
                            <div key={i} className="glass group p-12 rounded-[2.5rem] border border-white/5 hover:border-[#00f3ff]/40 transition-all duration-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                                    {f.icon}
                                </div>
                                <div className="mb-10 inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white/5 group-hover:bg-[#00f3ff]/10 group-hover:scale-110 transition-all duration-700">
                                    {React.cloneElement(f.icon, { size: 40 })}
                                </div>
                                <h3 className="text-3xl font-black mb-6 text-white tracking-tight">{f.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-40 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00f3ff]/10 to-transparent pointer-events-none" />
                <div className="mx-auto max-w-5xl glass p-16 md:p-24 rounded-[4rem] text-center border-t-2 border-[#00f3ff]/30 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-2 bg-black border border-[#00f3ff]/30 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#00f3ff]">
                        System Ready
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight">PROTECT YOUR <br /><span className="text-[#00f3ff] neon-text-blue">LEGACY</span></h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/register" className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-[#00f3ff] transition-all shadow-white/10 shadow-2xl active:scale-95">
                            Secure Domain
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-20 px-6 relative z-10 bg-black">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <div className="flex items-center gap-3">
                                <Shield size={28} className="text-[#00f3ff]" />
                                <span className="font-black text-2xl tracking-[0.2em]">CYBER-RESILIENT</span>
                            </div>
                            <p className="text-gray-600 font-bold text-xs uppercase tracking-[0.2em]">Safeguarding the global infrastructure grid.</p>
                        </div>
                        <div className="flex gap-12 text-gray-500 font-bold text-xs uppercase tracking-widest">
                            <a href="#" className="hover:text-[#00f3ff] transition-colors">Privacy</a>
                            <a href="#" className="hover:text-[#00f3ff] transition-colors">Terms</a>
                            <a href="#" className="hover:text-[#00f3ff] transition-colors">Audit logs</a>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-white/5 text-center">
                        <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.5em]">© 2026 CRIP ADVANCED SYSTEMS. VERIFIED SECURE.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .stroke-text {
                    color: transparent;
                }
            `}</style>
        </div>
    );
};

export default Landing;
