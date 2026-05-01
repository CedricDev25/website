import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, Info, Star, Calendar } from 'lucide-react';
import { AIAnalysis } from '../types';
import { motion } from 'motion/react';

interface AIInsightsProps {
  analysis: AIAnalysis | null;
}

export default function AIInsights({ analysis }: AIInsightsProps) {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Savings Rate" 
          value={`${analysis.savingsRate}%`} 
          desc="of your income"
          icon={<Star className="text-amber-500" size={20} />}
        />
        <StatCard 
          label="Leftover" 
          value={`$${analysis.remainingBudget.toLocaleString()}`} 
          desc="at month end"
          icon={<TrendingUp className="text-green-500" size={20} />}
        />
        <StatCard 
          label="Biggest Spend" 
          value={analysis.biggestSpend} 
          desc="highest category"
          icon={<CheckCircle2 className="text-blue-500" size={20} />}
        />
      </div>

      {/* Goal Section */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative shadow-xl shadow-indigo-100">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500/30 rounded-xl backdrop-blur-sm">
              <Calendar size={20} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">Recommended Goal</span>
          </div>
          <h4 className="text-2xl font-bold mb-1">{analysis.savingsGoal.label}</h4>
          <p className="text-indigo-100 mb-6 text-sm">Actionable target based on your current surplus.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold opacity-70 mb-1 uppercase">Monthly Saving</p>
              <p className="text-xl font-bold">${analysis.savingsGoal.monthlySaving}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold opacity-70 mb-1 uppercase">Timeframe</p>
              <p className="text-xl font-bold">{analysis.savingsGoal.yearsToGoal} Years</p>
            </div>
          </div>
        </div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Key Insights</h5>
        {analysis.insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border ${
              insight.type === 'warn' ? 'bg-red-50/50 border-red-100 text-red-700' :
              insight.type === 'good' ? 'bg-green-50/50 border-green-100 text-green-700' :
              'bg-blue-50/50 border-blue-100 text-blue-700'
            }`}
          >
            <div className="mt-0.5">
              {insight.type === 'warn' ? <AlertCircle size={18} /> :
               insight.type === 'good' ? <CheckCircle2 size={18} /> :
               <Info size={18} />}
            </div>
            <p className="text-sm font-medium leading-relaxed">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, desc, icon }: { label: string, value: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{desc}</p>
    </div>
  );
}
