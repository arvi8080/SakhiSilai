import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Scissors, ShieldAlert } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setRole } = useAuth();

  return (
    <div className="bg-stone-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md">
      <div className="flex items-center gap-2">
        <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
          Demo Mode
        </span>
        <span className="text-stone-300 hidden sm:inline">
          Switch role to test full workflow:
        </span>
      </div>

      <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-lg border border-stone-700">
        <button
          onClick={() => setRole('customer')}
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
            currentRole === 'customer'
              ? 'bg-[#D9534F] text-white shadow'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Customer View</span>
        </button>

        <button
          onClick={() => setRole('tailor')}
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
            currentRole === 'tailor'
              ? 'bg-[#1B4D3E] text-white shadow'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Tailor Dashboard</span>
        </button>

        <button
          onClick={() => setRole('admin')}
          className={`px-2.5 py-1 rounded-md transition flex items-center gap-1.5 font-medium ${
            currentRole === 'admin'
              ? 'bg-amber-600 text-white shadow'
              : 'text-stone-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Admin Console</span>
        </button>
      </div>
    </div>
  );
};
