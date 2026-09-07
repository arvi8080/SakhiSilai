import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Clock,
  Scissors,
  CheckCircle,
  PlusCircle,
  Ruler,
  ChevronRight,
  PackageCheck
} from 'lucide-react';

interface CustomerDashboardPageProps {
  setActiveTab: (tab: string) => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({ setActiveTab, onTrackOrder }) => {
  const { orders, measurements, saveMeasurement, selectedVillage, selectedDistrict, selectedState } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTabSub] = useState<'orders' | 'measurements'>('orders');
  const [showAddM, setShowAddM] = useState(false);

  // New Measurement Form
  const [mLabel, setMLabel] = useState('');
  const [mType, setMType] = useState('Blouse');
  const [bust, setBust] = useState('36 in');
  const [waist, setWaist] = useState('30 in');
  const [length, setLength] = useState('14.5 in');

  const myOrders = orders.filter(o => o.customerId === currentUser.id);
  const activeOrders = myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const pastOrders = myOrders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  const handleSaveM = (e: React.FormEvent) => {
    e.preventDefault();
    saveMeasurement({
      userId: currentUser.id,
      label: mLabel || `${currentUser.name} - ${mType}`,
      clothingType: mType,
      bustOrChest: bust,
      waist,
      length
    });
    setShowAddM(false);
    setMLabel('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* USER PROFILE HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D9534F] shadow-md"
          />
          <div>
            <span className="bg-amber-100 text-[#1B4D3E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Customer Account
            </span>
            <h1 className="text-2xl font-black text-stone-900 mt-0.5">{currentUser.name}</h1>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#D9534F]" />
              <span>{selectedVillage}, {selectedDistrict} ({selectedState})</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('find_tailors')}
            className="flex-1 sm:flex-none px-5 py-3 bg-[#D9534F] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
          >
            <Scissors className="w-4 h-4 rotate-45" />
            <span>Book New Order</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div className="flex border-b border-stone-200 text-sm font-bold gap-6">
        <button
          onClick={() => setActiveTabSub('orders')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-[#D9534F] text-[#D9534F]' : 'border-transparent text-stone-500'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>My Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('measurements')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'measurements' ? 'border-[#D9534F] text-[#D9534F]' : 'border-transparent text-stone-500'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>Saved Measurements ({measurements.length})</span>
        </button>
      </div>

      {/* ACTIVE ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Active Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D9534F]" />
              <span>Active In-Progress Orders ({activeOrders.length})</span>
            </h3>

            {activeOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
                <p className="text-sm text-stone-500">No active orders right now.</p>
                <button
                  onClick={() => setActiveTab('find_tailors')}
                  className="px-4 py-2 bg-[#1B4D3E] text-white text-xs font-bold rounded-xl"
                >
                  Find Nearby Tailor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                        <span className="font-bold text-xs text-stone-400">{ord.orderNumber}</span>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {ord.designImage && (
                          <img src={ord.designImage} alt={ord.designTitle} className="w-16 h-18 rounded-xl object-cover bg-stone-100" />
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-stone-900">{ord.designTitle}</h4>
                          <p className="text-xs text-stone-500">Tailor: <strong>{ord.tailorName}</strong> ({ord.tailorVillage})</p>
                          <span className="font-extrabold text-sm text-[#D9534F] block mt-1">₹{ord.price}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onTrackOrder(ord.id)}
                      className="w-full py-2.5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <span>Track Live Timeline</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Orders Section */}
          <div className="space-y-4 pt-6 border-t border-stone-200">
            <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Completed Order History ({pastOrders.length})</span>
            </h3>

            {pastOrders.map(ord => (
              <div key={ord.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    ✓
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900">{ord.designTitle}</h4>
                    <p className="text-stone-500">Completed by {ord.tailorName} • ₹{ord.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => onTrackOrder(ord.id)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg"
                >
                  View Details & Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVED MEASUREMENTS TAB */}
      {activeTab === 'measurements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-stone-900">Saved Measurement Profiles</h3>
            <button
              onClick={() => setShowAddM(true)}
              className="px-4 py-2 bg-[#D9534F] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Profile</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {measurements.map(m => (
              <div key={m.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-bold text-sm text-stone-900">{m.label}</h4>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">{m.clothingType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs bg-stone-50 p-3 rounded-2xl">
                  <div>
                    <span className="font-bold text-stone-800">{m.bustOrChest}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Bust</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.waist}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Waist</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800">{m.length}</span>
                    <span className="text-[9px] text-stone-400 block uppercase">Length</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ADD MEASUREMENT MODAL */}
          {showAddM && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <h3 className="font-bold text-base text-stone-900">Save New Measurement</h3>
                <form onSubmit={handleSaveM} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Profile Name (e.g. My Festive Blouse)"
                      value={mLabel}
                      onChange={e => setMLabel(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs"
                      required
                    />
                    <select
                      value={mType}
                      onChange={e => setMType(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-bold"
                    >
                      <option value="Blouse">Blouse</option>
                      <option value="Suit & Salwar">Suit & Salwar</option>
                      <option value="Kurti / Dress">Kurti / Dress</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Bust (36 in)"
                      value={bust}
                      onChange={e => setBust(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Waist (30 in)"
                      value={waist}
                      onChange={e => setWaist(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Length (14 in)"
                      value={length}
                      onChange={e => setLength(e.target.value)}
                      className="bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddM(false)} className="flex-1 py-2 border rounded-xl text-xs">Cancel</button>
                    <button type="submit" className="flex-1 py-2 bg-[#D9534F] text-white rounded-xl text-xs font-bold">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
