import { useState, useRef, useEffect, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MessageSquare, X, Send, Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '../../services/ai';
import { cn } from '../../lib/utils';

interface LayoutProps {
  children: ReactNode;
  role: 'admin' | 'super_admin';
  onRoleChange: (role: 'admin' | 'super_admin') => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Layout({ children, role, onRoleChange, activePage, onNavigate }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: `Hello! I'm your Wema SmartAdmin assistant. Ask me about risk trends, specific accounts, or compliance policies.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Context for AI (simplified)
    const context = `Current Role: ${role}. Active Page: ${activePage}.`;
    
    const response = await chatWithAI(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        role={role} 
        onRoleChange={onRoleChange} 
        activePage={activePage}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 overflow-auto relative w-full">
        {/* Mobile Header */}
        <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSidebarOpen(true)} className="p-1">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold">Wema SmartAdmin</span>
          </div>
          <div className="text-xs font-mono bg-slate-800 px-2 py-1 rounded">
            {role === 'admin' ? 'ADMIN' : 'SUPER'}
          </div>
        </div>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
          {children}
        </div>

        {/* Floating AI Chat Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
              >
                <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-medium">Wema Assistant</span>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-primary-500 rounded p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "max-w-[85%] rounded-2xl p-3 text-sm",
                        msg.role === 'user' 
                          ? "bg-primary-600 text-white ml-auto rounded-br-none" 
                          : "bg-white border border-slate-200 text-slate-700 mr-auto rounded-bl-none shadow-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="bg-white border border-slate-200 text-slate-500 mr-auto rounded-2xl rounded-bl-none shadow-sm p-3 text-xs flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-75" />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-150" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about risk, loans, or compliance..."
                      className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </main>
    </div>
  );
}
