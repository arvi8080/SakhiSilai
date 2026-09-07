import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Navigation, X, Check } from 'lucide-react';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
  const { locations, selectedState, selectedDistrict, selectedVillage, setSelectedLocation } = useData();
  const { t } = useLanguage();

  const [stateVal, setStateVal] = useState(selectedState);
  const [districtVal, setDistrictVal] = useState(selectedDistrict);
  const [villageVal, setVillageVal] = useState(selectedVillage);
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isOpen) return null;

  const currentStateObj = locations.find(s => s.name === stateVal) || locations[0];
  const currentDistricts = currentStateObj ? currentStateObj.districts : [];
  const currentDistObj = currentDistricts.find(d => d.name === districtVal) || currentDistricts[0];
  const currentVillages = currentDistObj ? currentDistObj.villages : [];

  const handleStateChange = (stName: string) => {
    setStateVal(stName);
    const stObj = locations.find(s => s.name === stName);
    if (stObj && stObj.districts.length > 0) {
      const firstDist = stObj.districts[0];
      setDistrictVal(firstDist.name);
      if (firstDist.villages.length > 0) {
        setVillageVal(firstDist.villages[0]);
      }
    }
  };

  const handleDistrictChange = (distName: string) => {
    setDistrictVal(distName);
    const distObj = currentDistricts.find(d => d.name === distName);
    if (distObj && distObj.villages.length > 0) {
      setVillageVal(distObj.villages[0]);
    }
  };

  const handleSave = () => {
    setSelectedLocation(stateVal, districtVal, villageVal);
    onClose();
  };

  const handleAutoDetect = () => {
    setIsDetecting(true);
    setTimeout(() => {
      // Simulating GPS detection to Mohanlalganj, Lucknow, UP
      setStateVal('Uttar Pradesh');
      setDistrictVal('Lucknow');
      setVillageVal('Mohanlalganj');
      setIsDetecting(false);
      setSelectedLocation('Uttar Pradesh', 'Lucknow', 'Mohanlalganj');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <div className="flex items-center gap-2 text-[#D9534F]">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold text-lg text-stone-900">{t('detectLocation')}</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auto Detect Button */}
        <button
          onClick={handleAutoDetect}
          disabled={isDetecting}
          className="w-full mb-5 bg-[#1B4D3E] hover:bg-[#133A2E] text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
        >
          <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
          <span>{isDetecting ? 'Detecting via GPS...' : t('detectLocation')}</span>
        </button>

        <div className="relative text-center my-3">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div>
          <span className="relative bg-white px-3 text-xs text-stone-400 font-semibold uppercase">Or Choose Manually</span>
        </div>

        {/* Selectors */}
        <div className="space-y-4 my-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('selectState')}</label>
            <select
              value={stateVal}
              onChange={e => handleStateChange(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
            >
              {locations.map(st => (
                <option key={st.id} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('selectDistrict')}</label>
            <select
              value={districtVal}
              onChange={e => handleDistrictChange(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
            >
              {currentDistricts.map(d => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">{t('selectVillage')}</label>
            <select
              value={villageVal}
              onChange={e => setVillageVal(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-[#D9534F] focus:outline-none"
            >
              {currentVillages.map((v, idx) => (
                <option key={idx} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-[#D9534F] hover:bg-[#C93B37] text-white rounded-xl font-semibold shadow-md flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
