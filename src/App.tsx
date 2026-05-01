import React, { useState } from 'react';
import { Sparkles, BarChart3, LayoutDashboard, Settings, User } from 'lucide-react';
import BudgetForm from './components/BudgetForm';
import BudgetCharts from './components/BudgetCharts';
import AIInsights from './components/AIInsights';
import { BudgetData, AIAnalysis } from './types';
import { analyzeBudget } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'budget' | 'insights'>('budget');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 3000,
    expenses: [
      { id: '1', category: 'Housing', amount: 1000 },
      { id: '2', category: 'Food', amount: 400 },
      { id: '3', category: 'Transport', amount: 200 },
    ],
  });

  const handleAnalyze = async (data: BudgetData) => {
    setBudgetData(data);
    setIsLoading(true);
    try {
      const result = await analyzeBudget(data);
      setAnalysis(result);
      setActiveTab('insights');
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("Something went wrong with the AI analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA]">
      {/* Sidebar Rail */}
      <aside className="w-20 lg:w-24 border-r border-gray-200 bg-white flex flex-col items-center py-8 gap-10">
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white scale-110 shadow-lg shadow-black/10">
          <Sparkles size={24} fill="currentColor" />
        </div>
        
        <nav className="flex flex-col gap-8 flex-1">
          <SidebarIcon icon={<LayoutDashboard size={24} />} active />
          <SidebarIcon icon={<BarChart3 size={24} />} />
          <SidebarIcon icon={<Settings size={24} />} />
        </nav>

        <div className="mt-auto">
          <SidebarIcon icon={<User size={24} />} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 italic serif">AI Budget Coach</h1>
            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Preview</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Live Engine</span>
            </div>
            <img 
              referrerPolicy="no-referrer"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </div>
        </header>

        {/* Dynamic Canvas */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Financial Intelligence</p>
                <h2 className="text-4xl font-bold text-gray-900">Dashboard</h2>
              </div>
              
              <div className="flex p-1 bg-gray-100 rounded-2xl">
                <button 
                  onClick={() => setActiveTab('budget')}
                  className={`px-6 py-2 rounded-xl transition-all font-semibold text-sm ${activeTab === 'budget' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  Planner
                </button>
                <button 
                  onClick={() => setActiveTab('insights')}
                  className={`px-6 py-2 rounded-xl transition-all font-semibold text-sm ${activeTab === 'insights' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 opacity-50 pointer-events-none'}`}
                  disabled={!analysis}
                >
                  Insights {analysis && <span className="ml-1 w-2 h-2 bg-indigo-500 rounded-full inline-block"></span>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[600px]">
              {/* Left Panel: Form */}
              <div className="lg:col-span-4 h-full">
                <BudgetForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>

              {/* Right Panel: Dynamic Content */}
              <div className="lg:col-span-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === 'budget' ? (
                    <motion.div
                      key="charts"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full"
                    >
                      <BudgetCharts expenses={budgetData.expenses} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <AIInsights analysis={analysis} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Blob */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-green-100/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

function SidebarIcon({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`p-3 rounded-2xl transition-all duration-300 ${active ? 'bg-gray-100 text-black shadow-inner scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
      {icon}
    </button>
  );
}
