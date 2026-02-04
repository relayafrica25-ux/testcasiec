import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Twitter, Award, Briefcase, Globe } from 'lucide-react';
import { TeamMember } from '../types';
import { storageService } from '../services/storageService';

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      try {
        const teamMembers = await storageService.getTeamMembers();
        setTeam(teamMembers);
      } catch (err) {
        console.error("Uplink failed:", err);
      }
      setLoading(false);
    };
    loadTeam();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-nova-900 selection:bg-nova-500">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-nova-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter text-white">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nova-400 to-purple-400 uppercase italic">Team.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            A diverse collective of financial engineers, strategic advisors, and market specialists dedicated to ‘unlocking value across enterprises’
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <section className="py-24 relative bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-grow bg-white/10"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nova-400">Our Team</h2>
            <div className="h-px flex-grow bg-white/10"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="group relative flex flex-col glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-nova-500/30 transition-all duration-500 hover:translate-y-[-8px]">
                <div className={`h-72 relative bg-gradient-to-br ${member.imageGradient} opacity-80 group-hover:opacity-100 transition-all duration-500`}>
                  {member.imageUrl ? (
                    <img src={member.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={member.name} />
                  ) : (
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest rounded-full">
                      {member.specialization}
                    </span>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                        <Linkedin size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow bg-nova-900/40">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-nova-400 transition-colors">{member.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-6">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-4 font-light">
                    {member.bio}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Linkedin size={18} /></a>}
                    {member.twitter && <a href={member.twitter} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-white transition-colors"><Twitter size={18} /></a>}
                    {member.email && <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-white transition-colors"><Mail size={18} /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};