import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import type { FabricHandoverMethod } from '../../types';
import { PaymentModal } from '../../components/PaymentModal';
import {
  Scissors,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  UserCheck,
  Ruler,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface CreateOrderPageProps {
  tailorId: string;
  preSelectedDesignId?: string;
  setActiveTab: (tab: string) => void;
  onOrderCreated: (orderId: string) => void;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({
  tailorId,
  preSelectedDesignId,
  setActiveTab,
  onOrderCreated
}) => {
  const { tailors, designs, measurements, createOrder, selectedVillage, selectedDistrict, selectedState } = useData();
  const { currentUser } = useAuth();
  const { t, lang } = useLanguage();

  const tailor = tailors.find(t => t.id === tailorId) || tailors[0];
  const selectedDesign = designs.find(d => d.id === preSelectedDesignId) || designs.find(d => d.tailorId === tailor.id);

  // Form State
  const [selectedDesignId, setSelectedDesignId] = useState<string>(selectedDesign?.id || '');
  const [handoverMethod, setHandoverMethod] = useState<FabricHandoverMethod>('customer_drop');
  const [measurementType, setMeasurementType] = useState<'saved' | 'manual' | 'drop'>('drop');
  const [selectedMeasurementId, setSelectedMeasurementId] = useState<string>(measurements[0]?.id || '');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [requiredDate, setRequiredDate] = useState<string>(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'partial_advance'>('upi');
  const [createdOrderData, setCreatedOrderData] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const activeDesign = designs.find(d => d.id === selectedDesignId) || selectedDesign;
  const price = activeDesign ? activeDesign.price : tailor.startingPrice;
  const isSameVillage = tailor.village.toLowerCase() === selectedVillage.toLowerCase();

  // Delivery Availability simulation: Available if delivery runner active in district
  const isDeliveryAvailable = selectedDistrict === 'Lucknow';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let measurementData: any = 'Handover during fabric drop';
    if (measurementType === 'saved') {
      const foundM = measurements.find(m => m.id === selectedMeasurementId);
      if (foundM) measurementData = foundM;
    }

    const created = createOrder({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerVillage: selectedVillage,
      customerDistrict: selectedDistrict,
      customerState: selectedState,
      tailorId: tailor.id,
      tailorName: tailor.name,
      tailorVillage: tailor.village,
      tailorPhone: tailor.phone,
      categoryId: activeDesign ? activeDesign.categoryId : 'blouse',
      categoryName: activeDesign ? activeDesign.categoryName : 'Blouse Stitching',
      designTitle: activeDesign ? activeDesign.title : 'Custom Stitching',
      designImage: activeDesign?.image,
      price,
      paymentMethod,
      advancePaid: paymentMethod === 'partial_advance' ? 200 : paymentMethod === 'upi' ? price : 0,
      paymentStatus: paymentMethod === 'upi' ? 'fully_paid' : paymentMethod === 'partial_advance' ? 'advance_paid' : 'pending',
      handoverMethod,
      hasDeliveryAvailable: isDeliveryAvailable,
      measurements: measurementData,
      specialInstructions: specialNotes,
      requiredDate
    });

    setCreatedOrderData(created);
    if (paymentMethod === 'upi' || paymentMethod === 'partial_advance') {
      setShowPaymentModal(true);
    } else {
      onOrderCreated(created.id);
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 animate-fade-in pb-16">
      <button
        onClick={() => setActiveTab('tailor_profile')}
        className="inline-flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-full border border-stone-200"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Tailor Profile</span>
      </button>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-8">
        {/* Order Header */}
        <div className="border-b border-stone-100 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-100 text-[#1B4D3E] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Step-by-Step Order Booking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              Book Stitching with {tailor.name}
            </h1>
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#D9534F]" />
              <span>Tailor Location: {tailor.village}, {tailor.district}</span>
            </p>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 text-right">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Total Price</span>
            <span className="font-black text-2xl text-[#D9534F]">₹{price}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-8">
          {/* STEP 1: SELECT DESIGN / SERVICE */}
          <div className="space-y-3">
            <label className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-[#D9534F] rotate-45" />
              <span>1. Choose Design or Service</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {designs.filter(d => d.tailorId === tailor.id).map(d => (
                <div
                  key={d.id}
                  onClick={() => setSelectedDesignId(d.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                    selectedDesignId === d.id
                      ? 'bg-amber-50/80 border-[#D9534F] ring-2 ring-[#D9534F]/20'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <img src={d.image} alt={d.title} className="w-14 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-stone-900">{lang === 'hi' ? (d.titleHi || d.title) : d.title}</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">₹{d.price} • {d.estDays} Days</p>
                  </div>
                  {selectedDesignId === d.id && <CheckCircle2 className="w-5 h-5 text-[#D9534F]" />}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: FABRIC HANDOVER METHOD */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1B4D3E]" />
              <span>2. Choose Fabric Handover Option</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Customer Drop */}
              <div
                onClick={() => setHandoverMethod('customer_drop')}
                className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                  handoverMethod === 'customer_drop'
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Option A: Direct Drop to Tailor</span>
                  </span>
                  {handoverMethod === 'customer_drop' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {t('dropAtTailorDesc')}
                </p>
                {isSameVillage && (
                  <span className="inline-block bg-emerald-200 text-emerald-900 font-bold text-[9px] px-2 py-0.5 rounded">
                    Recommended for same village ({tailor.village})
                  </span>
                )}
              </div>

              {/* Option B: Delivery / Pickup */}
              <div
                onClick={() => {
                  if (isDeliveryAvailable) setHandoverMethod('delivery_pickup');
                }}
                className={`p-4 rounded-2xl border transition space-y-2 ${
                  !isDeliveryAvailable
                    ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                    : handoverMethod === 'delivery_pickup'
                    ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-600/20 cursor-pointer'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-700" />
                    <span>Option B: Home Pickup & Delivery</span>
                  </span>
                  {handoverMethod === 'delivery_pickup' && <CheckCircle2 className="w-4 h-4 text-amber-700" />}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {t('deliveryPickupDesc')}
                </p>
                {!isDeliveryAvailable && (
                  <p className="text-[10px] text-stone-500 font-bold italic flex items-center gap-1 text-amber-700">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{t('noDeliveryWarning')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: MEASUREMENTS */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <label className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-600" />
              <span>3. Provide Measurements</span>
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMeasurementType('drop')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  measurementType === 'drop' ? 'bg-[#1B4D3E] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Handover during fabric drop
              </button>
              <button
                type="button"
                onClick={() => setMeasurementType('saved')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  measurementType === 'saved' ? 'bg-[#1B4D3E] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Use Saved Measurement Profile
              </button>
            </div>

            {measurementType === 'saved' && (
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <label htmlFor="selectedMeasurementProfile" className="block text-xs font-bold text-stone-700">Select Saved Profile</label>
                <select
                  id="selectedMeasurementProfile"
                  name="selectedMeasurementProfile"
                  value={selectedMeasurementId}
                  onChange={e => setSelectedMeasurementId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
                >
                  {measurements.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.clothingType}) - Bust: {m.bustOrChest}, Waist: {m.waist}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* STEP 4: REQUIRED DATE & PAYMENT */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label htmlFor="requiredDate" className="font-extrabold text-xs text-stone-900 block mb-1">
                Required Completion Date
              </label>
              <input
                id="requiredDate"
                name="requiredDate"
                type="date"
                value={requiredDate}
                onChange={e => setRequiredDate(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div>
              <label htmlFor="orderPaymentMethod" className="font-extrabold text-xs text-stone-900 block mb-1">
                Payment Method
              </label>
              <select
                id="orderPaymentMethod"
                name="orderPaymentMethod"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-[#1B4D3E]"
              >
                <option value="upi">📱 UPI / QR Code Payment (100% Instant)</option>
                <option value="partial_advance">⚡ Partial Advance (₹200 Booking)</option>
                <option value="cod">💵 Cash on Completion (100% Direct)</option>
              </select>
            </div>

            <div>
              <label htmlFor="specialInstructions" className="font-extrabold text-xs text-stone-900 block mb-1">
                Special Instructions (Optional)
              </label>
              <input
                id="specialInstructions"
                name="specialInstructions"
                type="text"
                placeholder="e.g. Add red piping, back dori, extra seam margin..."
                value={specialNotes}
                onChange={e => setSpecialNotes(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>
          </div>

          {/* CONFIRM ORDER BUTTON */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Zero commission platform. Tailor receives 100% of ₹{price}.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-[#D9534F] hover:bg-[#C93B37] text-white font-extrabold text-base rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{paymentMethod === 'cod' ? t('placeOrderBtn') : 'Proceed to Payment & Confirm'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* PAYMENT MODAL */}
      {createdOrderData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            onOrderCreated(createdOrderData.id);
          }}
          orderId={createdOrderData.id}
          orderNumber={createdOrderData.orderNumber}
          amount={price}
          tailorName={tailor.name}
          initialMethod={paymentMethod}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            onOrderCreated(createdOrderData.id);
          }}
        />
      )}
    </div>
  );
};

