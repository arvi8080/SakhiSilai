import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToFirebase } from '../../config/firebase';
import { PlusCircle, Sparkles, Star, MessageSquare, UploadCloud, Loader2 } from 'lucide-react';

interface CustomDesignRequestPageProps {
  setActiveTab: (tab: string) => void;
  onOrderCreated: (orderId: string) => void;
}

export const CustomDesignRequestPage: React.FC<CustomDesignRequestPageProps> = ({ onOrderCreated }) => {
  const { customRequests, categories, submitCustomRequest, acceptQuoteOffer, selectedVillage, selectedDistrict, selectedState } = useData();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Dress & Kurti');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80');
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const [requiredDate, setRequiredDate] = useState(
    new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storagePath = `custom_requests/${Date.now()}_${file.name}`;
      const downloadUrl = await uploadImageToFirebase(file, storagePath);
      setImageUrl(downloadUrl);
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCustomRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerVillage: selectedVillage,
      customerDistrict: selectedDistrict,
      customerState: selectedState,
      requestTitle: title,
      clothingCategory: category,
      referenceImage: imageUrl,
      specialInstructions: notes,
      requiredDate
    });

    setSubmittedSuccess(true);
    setTitle('');
    setNotes('');
  };

  const myRequests = customRequests.filter(r => r.customerId === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-[#D9534F] text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-amber-100 font-extrabold text-xs uppercase mb-1">
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Hyperlocal Custom Bidding System</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">Upload Custom Design & Get Tailor Quotes</h1>
        <p className="text-xs sm:text-sm text-stone-100 mt-1 max-w-2xl">
          Found a dress design on Pinterest or Instagram? Upload the image here. Nearby verified tailors will review it and send custom price & completion time offers!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM TO UPLOAD */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-5">
          <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#D9534F]" />
            <span>Create New Custom Request</span>
          </h3>

          {submittedSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center justify-between">
              <span>Request Broadcasted to nearby tailors in {selectedVillage}! Check quotes below.</span>
              <button onClick={() => setSubmittedSuccess(false)} className="text-emerald-700 underline">Dismiss</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Design Title / Style Name</label>
              <input
                type="text"
                placeholder="e.g. Princess Cut Boatneck Kurti with Organza Sleeves"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.nameEn}>{c.nameEn}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Upload Dress Photo / Reference Design</label>
              
              <div className="flex flex-col sm:flex-row gap-3 items-center mb-3">
                <label className="w-full sm:w-auto px-4 py-2.5 bg-pink-50 hover:bg-pink-100 text-[#E91E63] font-bold text-xs rounded-xl border border-pink-200 cursor-pointer transition flex items-center justify-center gap-2">
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E91E63]" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-[#E91E63]" />
                  )}
                  <span>{isUploading ? 'Uploading to Firebase Storage...' : 'Upload Photo (Firebase Cloud)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>

                <div className="flex gap-2">
                  {sampleImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Sample"
                      onClick={() => setImageUrl(img)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer border-2 transition ${
                        imageUrl === img ? 'border-[#E91E63] ring-2 ring-pink-100 scale-105' : 'border-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <input
                type="url"
                placeholder="Or paste image URL"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Required Completion Date</label>
              <input
                type="date"
                value={requiredDate}
                onChange={e => setRequiredDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Special Instructions for Tailors</label>
              <textarea
                rows={3}
                placeholder="Describe fabric type, lining preference, piping, latkan dori, fitting..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D9534F] hover:bg-[#C93B37] text-white font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Broadcast Request to Nearby Tailors</span>
            </button>
          </form>
        </div>

        {/* MY ACTIVE REQUESTS & OFFERS RECEIVED */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-stone-900">Quotes & Bids Received ({myRequests.length})</h3>

          {myRequests.length === 0 ? (
            <p className="text-xs text-stone-400">You haven't posted any custom design requests yet.</p>
          ) : (
            myRequests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-md space-y-4">
                <div className="flex gap-4 items-start">
                  <img src={req.referenceImage} alt={req.requestTitle} className="w-20 h-24 rounded-2xl object-cover bg-stone-100" />
                  <div>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      {req.clothingCategory}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 mt-1">{req.requestTitle}</h4>
                    <p className="text-[11px] text-stone-500 line-clamp-2">{req.specialInstructions}</p>
                    <span className="text-[10px] text-stone-400 block mt-1">Needed by: {req.requiredDate}</span>
                  </div>
                </div>

                {/* OFFERS LIST */}
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <h5 className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    <span>Offers from Tailors ({req.offers.length})</span>
                  </h5>

                  {req.offers.length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic">Waiting for nearby tailors to submit quotes...</p>
                  ) : (
                    req.offers.map(off => (
                      <div key={off.id} className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-xs flex items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-stone-900">{off.tailorName} ({off.tailorVillage})</span>
                          <p className="text-stone-600 text-[11px] font-medium">"{off.note}"</p>
                          <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{off.tailorRating} Rating</span>
                          </span>
                        </div>

                        <div className="text-right whitespace-nowrap">
                          <span className="font-black text-base text-[#D9534F] block">₹{off.price}</span>
                          <span className="text-[10px] text-stone-500 block">{off.estDays} Days</span>

                          {req.status === 'open' ? (
                            <button
                              onClick={() => {
                                const createdOrd = acceptQuoteOffer(req.id, off.id);
                                if (createdOrd) onOrderCreated(createdOrd.id);
                              }}
                              className="mt-1 px-3 py-1 bg-[#1B4D3E] text-white font-bold text-[10px] rounded-lg shadow"
                            >
                              Accept & Book
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-bold">Accepted</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
