import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How fast can I get funded?",
    answer: "Our streamlined AI-driven process allows for approvals in as little as 4 hours and funding within 24-48 hours for most business term loans and lines of credit."
  },
  {
    question: "Do you require collateral?",
    answer: "It depends on the product. Our unsecured business lines of credit and revenue-based financing do not require specific collateral. Real estate and equipment financing are typically secured by the asset itself."
  },
  {
    question: "What are the minimum requirements?",
    answer: "Generally, we look for businesses with at least 6 months of operating history and $10,000 in monthly revenue. However, we have specialized programs for startups and real estate investors that have different criteria."
  },
  {
    question: "Can I apply if I have bad credit?",
    answer: "Yes. We evaluate the overall health of your business, not just your personal credit score. We have funding options available for a wide range of credit profiles, including those rebuilding their credit."
  },
  {
    question: "What industries do you serve?",
    answer: "We fund almost every industry including construction, medical, restaurants, retail, transportation, and technology. We have specific expertise in high-growth sectors."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-nova-900">
       <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-nova-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
       <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
         <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-gray-200 text-[10px] font-black uppercase tracking-[0.4em] mb-6 animate-fade-in-up">
              <HelpCircle size={16} className="text-nova-400" />
              <span>Institutional Support</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 animate-fade-in-up uppercase italic tracking-tighter">
              Clear answers for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 to-purple-400">
                smart decisions.
              </span>
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto animate-fade-in-up font-medium">
              We believe in transparency. Here is everything you need to know about our funding process.
            </p>
         </div>

         <div className="space-y-4">
           {faqs.map((faq, index) => (
             <div 
               key={index}
               className={`group rounded-3xl border transition-all duration-300 animate-fade-in-up ${
                 openIndex === index 
                   ? 'bg-white/10 border-nova-500/50 shadow-[0_0_40px_rgba(37,99,235,0.1)]' 
                   : 'bg-white/[0.03] border-white/10 hover:bg-white/5 hover:border-white/20'
               }`}
             >
               <button
                 onClick={() => toggle(index)}
                 className="w-full flex items-center justify-between p-8 text-left focus:outline-none"
               >
                 <span className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                   {faq.question}
                 </span>
                 <div className={`p-2.5 rounded-xl transition-all duration-300 ${openIndex === index ? 'bg-nova-500 text-white rotate-180 shadow-lg' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}>
                   {openIndex === index ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                 </div>
               </button>
               
               <div 
                 className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
               >
                 <div className="px-8 pb-8 pt-0 text-gray-200 leading-relaxed font-medium text-lg border-t border-white/10 mt-2">
                   {faq.answer}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
    </section>
  );
};