import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Phone, Mail, MapPin, Send, CheckCircle, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  setActiveTab?: (tab: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { lang } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-4 animate-fade-in sm:px-6">
      {/* PAGE HEADER */}
      <div className="rounded-[28px] border border-[#F2D6E1] bg-[#FFF5F8] px-6 py-7 sm:px-8 sm:py-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#F7C0D8] bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#D43A72]">
          <Mail className="h-3.5 w-3.5" />
          {lang === 'hi' ? 'सखी सहायता केंद्र' : 'Sakhi Support & Contact'}
        </span>
        <h1 className="mt-4 text-3xl font-black text-[#2A1B3D] sm:text-4xl">
          {lang === 'hi' ? 'हमसे संपर्क करें (Contact Us)' : 'Get in Touch with SakhiSilai'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
          {lang === 'hi'
            ? 'सिलाई बुकिंग, दर्जी पंजीकरण या किसी भी सवाल के लिए हमसे बेझिझक संपर्क करें'
            : 'Need assistance with stitching orders, tailor registration, or general inquiries?'}
        </p>
      </div>

      {/* HELPLINE CARDS & FORM */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
        <div className="space-y-5">
          <div className="space-y-4">
            <h3 className="px-1 text-lg font-extrabold text-[#2A1B3D]">
              {lang === 'hi' ? 'डायरेक्ट हेल्पलाइन व केंद्र' : 'Direct Helpline & Centers'}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF1F6] text-[#D43A72]">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                    {lang === 'hi' ? 'टोल-फ्री हेल्पलाइन' : 'Toll-Free Helpline'}
                  </span>
                  <span className="break-words text-base font-extrabold text-[#2A1B3D] sm:text-lg">1800-SAKHI-SILAI</span>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {lang === 'hi' ? 'सोमवार से रविवार, सुबह 8 बजे से रात 8 बजे तक' : 'Mon - Sun, 8:00 AM to 8:00 PM IST'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F8F6] text-[#1B4D3E]">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                    {lang === 'hi' ? 'सहायता ईमेल' : 'Support Email'}
                  </span>
                  <a href="mailto:help@sakhisilai.org" className="break-words text-sm font-extrabold text-[#2A1B3D] hover:text-[#D43A72]">
                    help@sakhisilai.org
                  </a>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {lang === 'hi' ? '24 घंटे में उत्तर मिलेगा' : 'Replies within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E4] text-[#9A6A00]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                    {lang === 'hi' ? 'मुख्य केंद्र' : 'Regional Tech Hub'}
                  </span>
                  <span className="text-sm font-extrabold text-[#2A1B3D]">
                    {lang === 'hi' ? 'लखनऊ व जयपुर ग्रामीण विकास केंद्र' : 'Lucknow & Jaipur Rural Tech Hub, India'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK FAQ ACCORDIONS */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-extrabold text-[#2A1B3D]">
              <HelpCircle className="w-4 h-4 text-[#E91E63]" />
              <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}</span>
            </h4>

              <div className="space-y-2 text-xs">
                <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <h5 className="font-bold text-stone-900">
                  {lang === 'hi' ? 'प्र. कपड़ा दर्जी को कैसे दिया जाता है?' : 'Q. How do I give fabric to the tailor?'}
                </h5>
                <p className="text-[11px] text-stone-600">
                  {lang === 'hi'
                    ? 'आप अपने ही गाँव में दर्जी के घर सीधे कपड़ा व नाप दे सकते हैं।'
                    : 'You can directly drop your fabric & measurements at the tailor’s home in your village.'}
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 p-3 space-y-1">
                <h5 className="font-bold text-stone-900">
                  {lang === 'hi' ? 'प्र. क्या दर्जी से कोई कमीशन लिया जाता है?' : 'Q. Is there any commission taken from tailors?'}
                </h5>
                <p className="text-[11px] text-stone-600">
                  {lang === 'hi'
                    ? 'नहीं! सखीसिलाई दर्जियों से 0% कमीशन लेता है। पूरी कमाई दर्जी बहन को मिलती है।'
                    : 'No! SakhiSilai takes 0% commission from tailors. 100% payout goes to the tailor.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTACT FORM */}
        <div className="space-y-6 rounded-[28px] border border-stone-200 bg-white p-6 sm:p-8">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-[#2A1B3D]">
              {lang === 'hi' ? 'संदेश या सवाल भेजें' : 'Send Us a Message'}
            </h3>
            <p className="text-sm leading-6 text-stone-500">
              {lang === 'hi' ? 'नीचे फ़ॉर्म भरें, हमारी सखी टीम आपसे संपर्क करेगी' : 'Fill out the form below and our support team will reach out'}
            </p>
          </div>

          {sentSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-900">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>
                {lang === 'hi'
                  ? 'धन्यवाद! आपका संदेश सखी टीम को प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।'
                  : 'Thank you! Your message has been received by our Sakhi support team.'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
            <div>
              <label htmlFor="publicContactName" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'आपका नाम (Your Name)' : 'Your Name'}
              </label>
              <input
                id="publicContactName"
                name="publicContactName"
                type="text"
                placeholder={lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-sm text-[#2A1B3D] focus:border-[#D43A72] focus:outline-none focus:ring-2 focus:ring-[#D43A72]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="publicContactPhone" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (Mobile Phone)' : 'Mobile Phone Number'}
              </label>
              <input
                id="publicContactPhone"
                name="publicContactPhone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-sm text-[#2A1B3D] focus:border-[#D43A72] focus:outline-none focus:ring-2 focus:ring-[#D43A72]/20"
                required
              />
            </div>

            <div>
              <label htmlFor="publicContactTopic" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'विषय (Topic)' : 'Topic / Inquiry Type'}
              </label>
              <select
                id="publicContactTopic"
                name="publicContactTopic"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-sm font-bold text-[#2A1B3D] focus:border-[#D43A72] focus:outline-none focus:ring-2 focus:ring-[#D43A72]/20"
              >
                <option value="general">{lang === 'hi' ? 'सामान्य सवाल (General Inquiry)' : 'General Inquiry'}</option>
                <option value="order">{lang === 'hi' ? 'सिलाई ऑर्डर संबंधी (Order Issue)' : 'Order Issue'}</option>
                <option value="tailor_reg">{lang === 'hi' ? 'दर्जी पंजीकरण सहायता (Tailor Registration)' : 'Tailor Registration'}</option>
                <option value="feedback">{lang === 'hi' ? 'सुझाव / प्रतिक्रिया (Feedback)' : 'Feedback'}</option>
              </select>
            </div>

            <div>
              <label htmlFor="publicContactMessage" className="block text-stone-700 mb-1">
                {lang === 'hi' ? 'संदेश / विवरण (Message)' : 'Message / Details'}
              </label>
              <textarea
                id="publicContactMessage"
                name="publicContactMessage"
                rows={4}
                placeholder={lang === 'hi' ? 'अपना सवाल या संदेश यहाँ लिखें...' : 'Write your question or feedback...'}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 p-3.5 text-sm font-medium text-[#2A1B3D] focus:border-[#D43A72] focus:outline-none focus:ring-2 focus:ring-[#D43A72]/20"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E91E63] py-3.5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(233,30,99,0.2)] transition hover:bg-[#D81B60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D43A72]"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'hi' ? 'संदेश भेजें (Send Message)' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
