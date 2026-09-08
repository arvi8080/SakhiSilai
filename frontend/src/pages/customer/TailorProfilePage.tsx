import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  MapPin,
  CheckCircle,
  Scissors,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Bookmark,
  MessageSquarePlus,
  Check
} from 'lucide-react';

interface TailorProfilePageProps {
  tailorId: string;
  setActiveTab: (tab: string) => void;
  onBookDesign: (tailorId: string, designId?: string) => void;
}

export const TailorProfilePage: React.FC<TailorProfilePageProps> = ({ tailorId, setActiveTab, onBookDesign }) => {
  const { tailors, designs, reviews, selectedVillage } = useData();
  const { lang } = useLanguage();
  const { isLoggedIn, setPendingRedirectTab, setPendingTailorId, setRedirectNotice } = useAuth();

  const [isSaved, setIsSaved] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const tailor = tailors.find(t => t.id === tailorId) || tailors[0];
  const tailorDesigns = designs.filter(d => d.tailorId === tailor.id);
  const tailorReviews = reviews.filter(r => r.tailorId === tailor.id);
  const isSameVillage = tailor.village.toLowerCase() === selectedVillage.toLowerCase();

  const handleSaveTailor = () => {
    if (!isLoggedIn) {
      setPendingRedirectTab('tailor_profile');
      setPendingTailorId(tailor.id);
      setRedirectNotice("🔐 दर्जी सहेजने (Bookmark Tailor) के लिए कृपया पहले लॉगिन करें (Please sign in to save tailors)");
      setActiveTab('auth');
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleWriteReviewClick = () => {
    if (!isLoggedIn) {
      setPendingRedirectTab('tailor_profile');
      setPendingTailorId(tailor.id);
      setRedirectNotice("🔐 समीक्षा (Review) लिखने के लिए कृपया पहले लॉगिन करें (Please sign in to write a review)");
      setActiveTab('auth');
      return;
    }
    setShowReviewModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('find_tailors')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tailors List</span>
      </button>

      {/* TAILOR PROFILE HEADER CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-[#1B4D3E] via-[#133A2E] to-stone-900 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4">
            {isSameVillage ? (
              <span className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Same Village Tailor ({tailor.village})</span>
              </span>
            ) : (
              <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{tailor.village}, {tailor.district}</span>
              </span>
            )}
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 gap-4 mb-6">
            <div className="flex items-end gap-4">
              <img
                src={tailor.avatar}
                alt={tailor.name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-stone-100"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-stone-900">{tailor.name}</h1>
                  {tailor.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  )}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D9534F]" />
                  <span>{tailor.addressApprox}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleSaveTailor}
                className={`px-4 py-3 font-bold text-xs rounded-xl border transition flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-pink-50 border-[#E91E63] text-[#E91E63]'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#E91E63]' : ''}`} />
                <span>{isSaved ? (lang === 'hi' ? 'सहेजा गया' : 'Saved') : (lang === 'hi' ? 'सहेजें' : 'Save')}</span>
              </button>

              <button
                onClick={() => onBookDesign(tailor.id)}
                className="flex-1 sm:flex-none px-6 py-3 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black text-sm rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Scissors className="w-4 h-4 rotate-45" />
                <span>Book Order with {tailor.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-6">
            "{tailor.bio}"
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/60">
              <div className="flex items-center justify-center gap-1 text-amber-600 font-extrabold text-base">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{tailor.rating}</span>
              </div>
              <span className="text-[10px] text-stone-500 font-semibold">{tailor.reviewCount} Reviews</span>
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60">
              <span className="font-extrabold text-emerald-800 text-base">{tailor.experienceYears} Years</span>
              <span className="text-[10px] text-stone-500 font-semibold block">Experience</span>
            </div>

            <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200/60">
              <span className="font-extrabold text-blue-800 text-base">{tailor.completedOrdersCount}</span>
              <span className="text-[10px] text-stone-500 font-semibold block">Orders Completed</span>
            </div>

            <div className="bg-purple-50/70 p-3 rounded-2xl border border-purple-200/60">
              <span className="font-extrabold text-purple-800 text-base">~{tailor.estCompletionDays} Days</span>
              <span className="text-[10px] text-stone-500 font-semibold block">Avg. Turnaround</span>
            </div>
          </div>
        </div>
      </div>

      {/* DESIGN CATALOG (DESIGN-WISE PRICING) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E91E63]" />
              <span>{tailor.name}'s Design Catalog & Rates</span>
            </h2>
            <p className="text-xs text-stone-500">Transparent prices set directly by tailor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tailorDesigns.map(d => (
            <div
              key={d.id}
              className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition flex gap-4"
            >
              <img src={d.image} alt={d.title} className="w-24 h-28 rounded-xl object-cover bg-stone-100" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    {d.categoryName}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mt-1">{lang === 'hi' ? (d.titleHi || d.title) : d.title}</h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{d.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                  <div>
                    <span className="font-extrabold text-base text-[#E91E63]">₹{d.price}</span>
                    <span className="text-[10px] text-stone-400 block">{d.estDays} Days Est.</span>
                  </div>

                  <button
                    onClick={() => onBookDesign(tailor.id, d.id)}
                    className="px-3 py-1.5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-bold text-xs rounded-lg shadow"
                  >
                    Select Design
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE WORK GALLERY */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-stone-900">Stitching Work Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tailor.galleryImages.map((img, idx) => (
            <img key={idx} src={img} alt="Stitching Work" className="w-full h-36 rounded-2xl object-cover hover:scale-102 transition shadow-sm" />
          ))}
        </div>
      </div>

      {/* REVIEWS & RATINGS */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-stone-900">Customer Feedback ({tailorReviews.length})</h3>
          <button
            onClick={handleWriteReviewClick}
            className="px-3.5 py-1.5 bg-pink-50 hover:bg-pink-100 text-[#E91E63] font-bold text-xs rounded-full border border-pink-200 transition flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{lang === 'hi' ? 'समीक्षा लिखें' : 'Write Review'}</span>
          </button>
        </div>

        {tailorReviews.length === 0 ? (
          <p className="text-xs text-stone-400">No reviews yet for this tailor.</p>
        ) : (
          <div className="space-y-3">
            {tailorReviews.map(r => (
              <div key={r.id} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{r.customerName} ({r.customerVillage})</span>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>
                <p className="text-stone-600">{r.comment}</p>
                <span className="text-[10px] text-stone-400 block">{r.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full space-y-4 border border-pink-100 shadow-2xl animate-fade-in">
            <h3 className="font-black text-lg text-[#2A1B3D]">
              {lang === 'hi' ? `${tailor.name} के लिए समीक्षा लिखें` : `Write Review for ${tailor.name}`}
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-700">रेटिंग चुनें (Rating):</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="p-1 text-2xl transition"
                  >
                    <Star className={`w-7 h-7 ${star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="profileReviewComment" className="block text-xs font-bold text-stone-700">आपकी टिप्पणी (Your Comment):</label>
              <textarea
                id="profileReviewComment"
                name="profileReviewComment"
                rows={3}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="बहुत बढ़िया सिलाई कार्य, सही समय पर मिला..."
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#E91E63] focus:outline-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                रद्द करें (Cancel)
              </button>

              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setNewComment('');
                  alert('समीक्षा सफलतापूर्वक जमा की गई! (Review submitted successfully!)');
                }}
                className="px-5 py-2 bg-[#E91E63] text-white text-xs font-black rounded-xl shadow flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>जमा करें (Submit Review)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
