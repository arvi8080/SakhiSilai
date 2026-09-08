import { Router, Request, Response } from 'express';
import { db } from '../data/db';
import type { PaymentRecord } from '../types';

export const paymentRouter = Router();

// GET /api/payments/order/:orderId - Retrieve all payments for an order
paymentRouter.get('/order/:orderId', (req: Request, res: Response) => {
  const { orderId } = req.params;
  const payments = db.getPaymentsByOrder(orderId);
  res.json({ success: true, count: payments.length, data: payments });
});

// POST /api/payments/qr-generate - Generate dynamic UPI QR payload & payload details
paymentRouter.post('/qr-generate', (req: Request, res: Response) => {
  const { orderId, amount, note } = req.body;
  const order = db.orders.find(o => o.id === orderId);

  const upiId = 'sakhisilai@upi';
  const payeeName = 'SakhiSilai Hyperlocal Women Tailors';
  const amountVal = Number(amount) || (order ? order.price : 500);

  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(
    note || `Order Payment #${order?.orderNumber || orderId}`
  )}`;

  res.json({
    success: true,
    data: {
      vpa: upiId,
      payeeName,
      amount: amountVal,
      upiString,
      qrImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`
    }
  });
});

// POST /api/payments/verify
paymentRouter.post('/verify', (req: Request, res: Response) => {
  const { orderId, paymentMethod, amount, transactionId } = req.body;
  const order = db.orders.find(o => o.id === orderId);
  const now = new Date().toISOString();
  const paymentAmt = Number(amount) || (order ? order.price : 400);

  const txnId = transactionId || 'TXN_' + Date.now();
  const newPayment: PaymentRecord = {
    id: 'pay_' + Date.now(),
    orderId: orderId || 'ord_101',
    customerId: order ? order.customerId : 'u_pria',
    tailorId: order ? order.tailorId : 't_sunita',
    amount: paymentAmt,
    paymentMethod: paymentMethod || 'upi',
    paymentStatus: 'fully_paid',
    transactionId: txnId,
    timestamp: now
  };

  db.addPayment(newPayment);
  if (order) {
    db.updateOrderPayment(orderId, 'fully_paid', paymentAmt);
  }

  res.json({ success: true, message: 'Payment verified and recorded in database', data: newPayment });
});

// POST /api/payments/process - Process a payment (COD, UPI, Partial Advance)
paymentRouter.post('/process', (req: Request, res: Response) => {
  const { orderId, paymentMethod, amount, transactionId } = req.body;

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  const now = new Date().toISOString();
  const paymentAmt = Number(amount) || order.price;
  const method = paymentMethod || 'upi';

  let newPaymentStatus: 'pending' | 'advance_paid' | 'fully_paid' = 'fully_paid';
  let updatedAdvancePaid = order.price;

  if (method === 'partial_advance') {
    newPaymentStatus = 'advance_paid';
    updatedAdvancePaid = paymentAmt;
  } else if (method === 'cod') {
    newPaymentStatus = 'fully_paid';
    updatedAdvancePaid = order.price;
  } else {
    // UPI / Online Full Payment
    newPaymentStatus = 'fully_paid';
    updatedAdvancePaid = order.price;
  }

  const txnId = transactionId || 'TXN_' + Date.now() + Math.floor(Math.random() * 1000);

  const newPayment: PaymentRecord = {
    id: 'pay_' + Date.now(),
    orderId,
    customerId: order.customerId,
    tailorId: order.tailorId,
    amount: paymentAmt,
    paymentMethod: method,
    paymentStatus: newPaymentStatus,
    transactionId: txnId,
    timestamp: now,
    receiptUrl: `http://localhost:5000/api/payments/order/${orderId}`
  };

  // Persist payment & update order status in SQLite
  db.addPayment(newPayment);
  db.updateOrderPayment(orderId, newPaymentStatus, updatedAdvancePaid);

  // Notify tailor of payment receipt
  db.addNotification({
    id: 'n_' + Date.now(),
    targetRole: 'tailor',
    recipientId: order.tailorId,
    titleEn: 'Payment Received',
    titleHi: 'भुगतान प्राप्त हुआ',
    messageEn: `Received ₹${paymentAmt} via ${method.toUpperCase()} for Order #${order.orderNumber}.`,
    messageHi: `आर्डर #${order.orderNumber} के लिए ₹${paymentAmt} का भुगतान प्राप्त हुआ।`,
    timestamp: now,
    isRead: false,
    type: 'order'
  });

  // Fetch updated order from SQLite
  const updatedOrder = db.orders.find(o => o.id === orderId);

  res.status(201).json({
    success: true,
    message: `Payment of ₹${paymentAmt} processed successfully via ${method.toUpperCase()}`,
    data: {
      payment: newPayment,
      order: updatedOrder
    }
  });
});
