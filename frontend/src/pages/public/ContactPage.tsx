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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 animate-fade-in pb-16 pt-4">
      {/* PAGE HEADER */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-pink-50 text-[#E91E63] text-xs font-black px-3.5 py-1 rounded-full border border-pink-200 uppercase tracking-wider">
          {lang === 'hi' ? 'सखी सहायता केंद्र' : 'Sakhi Support & Contact'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2A1B3D]">
          {lang === 'hi' ? 'हमसे संपर्क करें (Contact Us)' : 'Get in Touch with SakhiSilai'}
        </h1>
        <p className="text-xs text-stone-500">
          {lang === 'hi'
            ? 'सिलाई बुकिंग, दर्जी पंजीकरण या किसी भी सवाल के लिए हमसे बेझिझक संपर्क करें'
            : 'Need assistance with stitching orders, tailor registration, or general inquiries?'}
        </p>
      </div>

      {/* HELPLINE CARDS & FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: DIRECT CONTACT DETAILS */}
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl space-y-6">
            <h3 className="font-extrabold text-xl text-[#2A1B3D]">
              {lang === 'hi' ? 'डायरेक्ट हेल्पलाइन व केंद्र' : 'Direct Helpline & Centers'}
            </h3>

            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-900 font-extrabold uppercase block">
                    {lang === 'hi' ? 'टोल-फ्री हेल्पलाइन' : 'Toll-Free Helpline'}
                  </span>
                  <span className="font-black text-lg text-stone-900">1800-SAKHI-SILAI</span>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'hi' ? 'सोमवार से रविवार, सुबह 8 बजे से रात 8 बजे तक' : 'Mon - Sun, 8:00 AM to 8:00 PM IST'}
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase block">
                    {lang === 'hi' ? 'सहायता ईमेल' : 'Support Email'}
                  </span>
                  <span className="font-extrabold text-sm text-stone-900">help@sakhisilai.org</span>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'hi' ? '24 घंटे में उत्तर मिलेगा' : 'Replies within 24 hours'}
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E91E63] text-white flex items-center justify-center shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase block">
                    {lang === 'hi' ? 'मुख्य केंद्र' : 'Regional Tech Hub'}
                  </span>
                  <span className="font-extrabold text-sm text-stone-900">
                    {lang === 'hi' ? 'लखनऊ व जयपुर ग्रामीण विकास केंद्र' : 'Lucknow & Jaipur Rural Tech Hub, India'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK FAQ ACCORDIONS */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md space-y-3">
            <h4 className="font-extrabold text-sm text-[#2A1B3D] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#E91E63]" />
              <span>{lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल (FAQs)' : 'Frequently Asked Questions'}</span>
            </h4>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <h5 className="font-bold text-stone-900">
                  {lang === 'hi' ? 'प्र. कपड़ा दर्जी को कैसे दिया जाता है?' : 'Q. How do I give fabric to the tailor?'}
                </h5>
                <p className="text-[11px] text-stone-600">
                  {lang === 'hi'
                    ? 'आप अपने ही गाँव में दर्जी के घर सीधे कपड़ा व नाप दे सकते हैं।'
                    : 'You can directly drop your fabric & measurements at the tailor’s home in your village.'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-xl text-[#2A1B3D]">
              {lang === 'hi' ? 'संदेश या सवाल भेजें' : 'Send Us a Message'}
            </h3>
            <p className="text-xs text-stone-500">
              {lang === 'hi' ? 'नीचे फ़ॉर्म भरें, हमारी सखी टीम आपसे संपर्क करेगी' : 'Fill out the form below and our support team will reach out'}
            </p>
          </div>

          {sentSuccess && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-bounce">
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
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
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
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm text-[#2A1B3D]"
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
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs text-[#2A1B3D] font-bold"
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
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs text-[#2A1B3D] font-medium"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black rounded-2xl shadow-lg shadow-pink-500/25 transition active:scale-95 text-xs flex items-center justify-center gap-2"
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
