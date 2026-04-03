import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Briefcase, 
  UserPlus, 
  UserCheck,
  Search, 
  Download, 
  Plus, 
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  referrer: string;
  category: string;
  created_at: string;
}

interface Stats {
  total: number;
  B2B: number;
  BFSI: number;
  B2E: number;
  NAPS: number;
  STAFFING: number;
}

const CATEGORIES = [
  { id: 'ALL', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'B2B', name: 'B2B Leads', icon: Building2 },
  { id: 'BFSI', name: 'BFSI Leads', icon: Briefcase },
  { id: 'B2E', name: 'B2E Leads', icon: Users },
  { id: 'NAPS', name: 'NAPS Leads', icon: UserPlus },
  { id: 'STAFFING', name: 'STAFFING Leads', icon: UserCheck },
];

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, B2B: 0, BFSI: 0, B2E: 0, NAPS: 0, STAFFING: 0 });
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showIntegration, setShowIntegration] = useState(false);

  const fetchLeads = async () => {
    try {
      const categoryParam = activeCategory === 'ALL' ? '' : `category=${activeCategory}`;
      const searchParam = search ? `search=${search}` : '';
      const query = [categoryParam, searchParam].filter(Boolean).join('&');
      
      const response = await fetch(`/api/leads${query ? '?' + query : ''}`);
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchStats();
    const interval = setInterval(() => {
      fetchLeads();
      fetchStats();
    }, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [activeCategory, search]);

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Referrer', 'Category', 'Created At'];
    const rows = leads.map(l => [
      l.id, l.name, l.email, l.phone, l.company, l.message, l.referrer, l.category, l.created_at
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${activeCategory.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#003366] text-white transition-all duration-300 flex flex-col fixed h-full z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0">
            <span className="text-[#003366] font-bold text-xl">T</span>
          </div>
          {sidebarOpen && <span className="font-bold text-lg tracking-tight">TVSTS Admin</span>}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-colors group",
                activeCategory === cat.id 
                  ? "bg-white/15 text-white" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <cat.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="font-medium">{cat.name}</span>}
              {sidebarOpen && activeCategory === cat.id && (
                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => setShowIntegration(!showIntegration)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors",
              showIntegration && "bg-white/10 text-white"
            )}
          >
            <ExternalLink className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="font-medium">Integration</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {activeCategory === 'ALL' ? 'Central Analytics Dashboard' : CATEGORIES.find(c => c.id === activeCategory)?.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 rounded-full text-sm transition-all w-64 outline-none"
              />
            </div>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors text-sm font-medium shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard label="Total Leads" value={stats.total} color="bg-blue-600" icon={LayoutDashboard} />
            <StatCard label="B2B" value={stats.B2B} color="bg-indigo-600" icon={Building2} />
            <StatCard label="BFSI" value={stats.BFSI} color="bg-emerald-600" icon={Briefcase} />
            <StatCard label="B2E" value={stats.B2E} color="bg-orange-600" icon={Users} />
            <StatCard label="NAPS" value={stats.NAPS} color="bg-purple-600" icon={UserPlus} />
            <StatCard label="STAFFING" value={stats.STAFFING} color="bg-rose-600" icon={UserCheck} />
          </div>

          {/* Integration Panel */}
          <AnimatePresence>
            {showIntegration && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#003366] font-bold">
                    <ShieldCheck className="w-5 h-5" />
                    WordPress Integration Instructions
                  </div>
                  <p className="text-sm text-slate-600">
                    Use the following endpoint and code snippet to send leads from your WordPress site.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Webhook URL</label>
                      <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs break-all border border-slate-200">
                        {window.location.origin}/api/leads
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">API Key (Header: x-api-key)</label>
                      <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs break-all border border-slate-200">
                        (Stored securely in backend)
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Example Fetch Code</label>
                    <pre className="p-4 bg-slate-900 text-slate-300 rounded-lg font-mono text-xs overflow-x-auto">
{`fetch("${window.location.origin}/api/leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    company: "Acme Corp",
    message: "Interested in B2B services",
    referrer: window.location.href // Logic uses this for categorization
  })
});`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leads Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">
                {activeCategory === 'ALL' ? 'Recent Leads (All Categories)' : `${activeCategory} Leads`}
              </h2>
              <span className="text-xs text-slate-400 font-medium">Showing {leads.length} leads</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Lead Info</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Company & Message</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Referrer</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.length > 0 ? leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{lead.name}</span>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">{lead.company || 'N/A'}</span>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lead.message || 'No message'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          lead.category === 'B2B' && "bg-indigo-100 text-indigo-700",
                          lead.category === 'BFSI' && "bg-emerald-100 text-emerald-700",
                          lead.category === 'B2E' && "bg-orange-100 text-orange-700",
                          lead.category === 'NAPS' && "bg-purple-100 text-purple-700",
                          lead.category === 'STAFFING' && "bg-rose-100 text-rose-700",
                        )}>
                          {lead.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-500 max-w-[150px] truncate" title={lead.referrer}>
                          {lead.referrer || 'Direct'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg text-white", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
