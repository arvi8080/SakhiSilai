import React, { useRef, useState } from 'react';
import {
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  X,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createRazorpayOrderApi, verifyRazorpayPaymentApi } from '../services/api';

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
  modal: { ondismiss: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => { open: () => void };
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
  tailorName: string;
  initialMethod?: 'cod' | 'upi' | 'partial_advance';
  onPaymentSuccess?: (paymentRecord: any) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  tailorName,
  initialMethod = 'upi',
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'cod' | 'upi' | 'partial_advance'>(initialMethod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<any>(null);
  const paymentIdempotencyKey = useRef(crypto.randomUUID());

  if (!isOpen) return null;

  const advanceAmount = 200;
  const currentPayableAmount =
    selectedMethod === 'partial_advance' ? Math.min(advanceAmount, amount) : amount;

  const handleConfirmPayment = async () => {
    if (selectedMethod === 'cod') {
      onClose();
      return;
    }
    setIsProcessing(true);

    try {
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Secure payment checkout could not be loaded.'));
          document.body.appendChild(script);
        });
      }

      const result = await createRazorpayOrderApi(orderId, selectedMethod, paymentIdempotencyKey.current);
      if (!window.Razorpay) throw new Error('Secure payment checkout is unavailable.');

      const checkout = new window.Razorpay({
        key: result.data.keyId,
        amount: result.data.amount,
        currency: result.data.currency,
        name: 'SakhiSilai',
        description: `Order ${orderNumber} with ${tailorName}`,
        order_id: result.data.orderId,
        handler: async paymentResponse => {
          try {
            const verified = await verifyRazorpayPaymentApi({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature
            });
            const receipt = verified.data.payment;
            setCompletedReceipt(receipt);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            onPaymentSuccess?.(verified.data);
          } catch (error) {
            alert(error instanceof Error ? error.message : 'Payment could not be confirmed.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) }
      });
      checkout.open();
    } catch (err) {
      setIsProcessing(false);
      alert(err instanceof Error ? err.message : 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1B4D3E] via-stone-900 to-[#D9534F] text-white p-5 sm:p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-stone-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Order #{orderNumber}
              </span>
              <span className="text-amber-200 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Secure Checkout
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">SakhiSilai Payment</h3>
            <p className="text-xs text-stone-300">Stitching by {tailorName}</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {completedReceipt ? (
            /* RECEIPT VIEW */
            <div className="space-y-6 text-center animate-fade-in py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Payment Verified
                </span>
                <h4 className="text-2xl font-black text-stone-900 mt-2">
                  ₹{completedReceipt.amount} Paid Successfully
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Receipt Ref: <strong>{completedReceipt.transactionId}</strong>
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 font-bold">Payment Method</span>
                  <span className="font-extrabold text-stone-900 uppercase">
                    {completedReceipt.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 font-bold">Payment Status</span>
                  <span className="font-extrabold text-emerald-700 uppercase">
                    {completedReceipt.paymentStatus === 'advance_paid' ? 'Advance Paid' : 'Fully Paid'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500 font-bold">Date & Time</span>
                  <span className="font-medium text-stone-700">
                    {new Date(completedReceipt.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-stone-700 font-bold">Tailor Direct Payout</span>
                  <span className="font-extrabold text-[#D9534F]">100% Direct to {tailorName}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white font-extrabold text-xs rounded-2xl shadow-lg transition"
              >
                Done & Return to Dashboard
              </button>
            </div>
          ) : (
            /* PAYMENT SELECTION & GATEWAY FORM */
            <>
              {/* PRICE BANNER */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">
                    Amount Payable Now
                  </span>
                  <span className="text-2xl font-black text-[#D9534F]">
                    ₹{currentPayableAmount}
                  </span>
                </div>
                {selectedMethod === 'partial_advance' && (
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                    Balance ₹{amount - currentPayableAmount} upon handover
                  </span>
                )}
              </div>

              {/* METHOD SELECTOR TABS */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-stone-900 block">
                  Select Payment Option:
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'upi'
                        ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/20 font-bold text-emerald-900'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <span className="text-[11px]">UPI Instant QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('partial_advance')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'partial_advance'
                        ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/20 font-bold text-amber-900'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span className="text-[11px]">₹200 Advance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('cod')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      selectedMethod === 'cod'
                        ? 'bg-stone-800 text-white border-stone-900 font-bold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-[11px]">Cash Handover</span>
                  </button>
                </div>
              </div>

              {/* METHOD DETAILS */}
              {selectedMethod === 'cod' ? (
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-stone-700">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span>Pay Cash Directly on Fabric Handover / Delivery</span>
                  </h4>
                  <p className="leading-relaxed text-stone-600">
                    No online payment needed now. Pay ₹{amount} cash directly to {tailorName} when you drop your fabric or inspect your finished dress.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-sm text-emerald-950 space-y-2">
                  <h4 className="font-bold">Verified checkout</h4>
                  <p className="text-xs leading-relaxed text-emerald-900">
                    Continue to Razorpay's secure checkout to choose an available payment method. SakhiSilai confirms payment directly with the provider; never share your UPI PIN or OTP.
                  </p>
                </div>
              )}

              {/* ACTION BUTTON */}
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-4 bg-[#D9534F] hover:bg-[#C93B37] disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing Payment Verification...</span>
                ) : (
                  <>
                    <span>{selectedMethod === 'cod' ? 'Continue with cash on completion' : `Continue to secure checkout · ₹${currentPayableAmount}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
