import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import type { OrderStatus } from '../../types';
import { PaymentModal } from '../../components/PaymentModal';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  Star,
  ArrowLeft,
  Sparkles,
  QrCode
} from 'lucide-react';

interface OrderTrackingPageProps {
  orderId: string;
  setActiveTab: (tab: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, setActiveTab }) => {
  const { orders, tailors, addReview } = useData();
  const { t, lang } = useLanguage();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);

  const order = orders.find(o => o.id === orderId) || orders[0];
  const tailor = tailors.find(t => t.id === order.tailorId);
  const balanceDue = order.price - (order.advancePaid || 0);

  const steps: { status: OrderStatus; labelEn: string; labelHi: string }[] = [
    { status: 'requested', labelEn: 'Order Requested', labelHi: 'ऑर्डर भेजा गया' },
    { status: 'accepted', labelEn: 'Tailor Accepted', labelHi: 'दर्जी ने स्वीकार किया' },
    { status: 'fabric_received', labelEn: 'Fabric Received', labelHi: 'कपड़ा प्राप्त हुआ' },
    { status: 'cutting_started', labelEn: 'Cutting Started', labelHi: 'कटाई शुरू हुई' },
    { status: 'stitching', labelEn: 'Stitching in Progress', labelHi: 'सिलाई जारी है' },
    { status: 'quality_check', labelEn: 'Quality Check Passed', labelHi: 'गुणवत्ता जाँच पास' },
    { status: 'ready', labelEn: 'Ready for Pickup / Delivery', labelHi: 'तैयार' },
    { status: 'completed', labelEn: 'Order Completed', labelHi: 'ऑर्डर पूरा हुआ' }
  ];

  const getStepIndex = (status: OrderStatus) => steps.findIndex(s => s.status === status);
  const currentStepIndex = getStepIndex(order.status);

  useEffect(() => {
    if (order.status === 'completed') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [order.status]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(order.id, rating, comment);
    setReviewSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      <button
        onClick={() => setActiveTab('dashboard')}
        className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Dashboard</span>
      </button>

      {/* HEADER SUMMARY CARD */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-[#1B4D3E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#D9534F] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {order.orderNumber}
              </span>
              <span className="text-amber-300 text-xs font-bold">
                {order.categoryName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">{order.designTitle}</h1>
            <p className="text-xs text-stone-300">Stitching by: <strong>{order.tailorName}</strong> ({order.tailorVillage})</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-right flex flex-col items-end gap-1 w-full sm:w-auto">
            <span className="text-[10px] text-stone-300 block font-bold uppercase">Price & Payment</span>
            <span className="font-extrabold text-xl text-amber-400">Total: ₹{order.price}</span>
            <span className="text-[10px] text-emerald-300 uppercase font-bold">
              {order.paymentStatus === 'fully_paid'
                ? '✅ Fully Paid'
                : order.paymentStatus === 'advance_paid'
                ? `⚡ Advance ₹${order.advancePaid} Paid (Due ₹${balanceDue})`
                : `💵 Cash / Due: ₹${order.price}`}
            </span>

            {order.paymentStatus !== 'fully_paid' && (
              <button
                onClick={() => setShowPayModal(true)}
                className="mt-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-[11px] rounded-xl flex items-center gap-1 shadow transition"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Pay Balance Online (UPI)</span>
              </button>
            )}
          </div>
        </div>
      </div>


      {/* VISUAL TIMELINE TRACKER */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 className="font-extrabold text-lg text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D9534F]" />
            <span>{t('orderTrackerTitle')}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Current Stage: {lang === 'hi' ? steps[currentStepIndex]?.labelHi : steps[currentStepIndex]?.labelEn}
          </span>
        </div>

        {/* STEPPER PROGRESS */}
        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-stone-200">
          {steps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.status} className="relative flex items-start gap-4">
                {/* Step Circle Indicator */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-[#D9534F] text-white ring-4 ring-red-100 scale-110 shadow'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>

                <div className="flex-1 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-xs sm:text-sm ${isDone ? 'text-stone-900' : 'text-stone-400'}`}>
                      {lang === 'hi' ? step.labelHi : step.labelEn}
                    </h4>
                    {isCurrent && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase animate-pulse">
                        In Progress Now
                      </span>
                    )}
                  </div>

                  {/* History Timestamp note if matched */}
                  {order.statusHistory.find(h => h.status === step.status) && (
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Updated: {new Date(order.statusHistory.find(h => h.status === step.status)!.timestamp).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FABRIC HANDOVER DETAILS CARD */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-md p-6 space-y-4">
        <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-700" />
          <span>Confirmed Fabric Handover Details</span>
        </h3>

        {order.handoverMethod === 'customer_drop' ? (
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2 text-stone-800">
            <p className="font-bold text-emerald-900 text-sm">Direct Village Handover Instructions:</p>
            <p>Please deliver your fabric & sample measurements to the tailor at:</p>
            <div className="bg-white p-3 rounded-xl border border-emerald-300 font-semibold space-y-1">
              <p><strong>Tailor Name:</strong> {order.tailorName}</p>
              <p><strong>Phone:</strong> {order.tailorPhone}</p>
              <p><strong>Full Handover Address:</strong> {tailor?.addressApprox || order.tailorVillage}</p>
            </div>
            <p className="text-[11px] text-stone-600 italic">
              Tip: Call {order.tailorName.split(' ')[0]} before dropping off the fabric!
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs space-y-2 text-stone-800">
            <p className="font-bold text-amber-900 text-sm">Doorstep Pickup Scheduled:</p>
            <p>Our Sakhi Runner will arrive at your location in {order.customerVillage} to collect fabric.</p>
          </div>
        )}

        <a
          href={`tel:${order.tailorPhone}`}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition"
        >
          <Phone className="w-4 h-4" />
          <span>Call Tailor ({order.tailorName})</span>
        </a>
      </div>

      {/* REVIEW FORM IF COMPLETED */}
      {order.status === 'completed' && (
        <div className="bg-white rounded-3xl border border-amber-200 shadow-lg p-6 space-y-4 bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center gap-2 text-amber-600">
            <Sparkles className="w-5 h-5 fill-amber-400" />
            <h3 className="font-bold text-lg text-stone-900">Rate & Review Your Tailor</h3>
          </div>

          {reviewSubmitted || order.rating ? (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
              Thank you! Your rating ({order.rating || rating} Stars) has been published on {order.tailorName}'s profile!
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400' : 'text-stone-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="reviewComment" className="block text-xs font-bold text-stone-700 mb-1">Your Review Comment</label>
                <textarea
                  id="reviewComment"
                  name="reviewComment"
                  rows={3}
                  placeholder="How was the fitting, stitching quality, and timing?"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D9534F] hover:bg-[#C93B37] text-white font-bold text-xs rounded-xl shadow"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      )}

      {/* PAYMENT MODAL FOR BALANCE PAYMENT */}
      <PaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        orderId={order.id}
        orderNumber={order.orderNumber}
        amount={balanceDue > 0 ? balanceDue : order.price}
        tailorName={order.tailorName}
        initialMethod="upi"
        onPaymentSuccess={() => {
          setShowPayModal(false);
        }}
      />
    </div>
  );
};

