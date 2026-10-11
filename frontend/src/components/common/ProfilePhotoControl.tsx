import React, { useRef, useState } from 'react';
import { Camera, ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { imageSource } from '../../utils/imageSource';
import { profileImageFileToDataUrl } from '../../utils/profileImage';

interface ProfilePhotoControlProps {
  className?: string;
}

export const ProfilePhotoControl: React.FC<ProfilePhotoControlProps> = ({ className = 'h-10 w-10' }) => {
  const { currentUser, updateUserAvatar } = useAuth();
  const { tailors, updateTailorProfile } = useData();
  const { lang } = useLanguage();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const isHindi = lang === 'hi';

  const saveAvatar = async (avatar: string) => {
    setError('');
    setIsSaving(true);
    try {
      await updateUserAvatar(avatar);
      if (currentUser.role === 'tailor') {
        const tailor = tailors.find(profile => profile.userId === currentUser.id);
        if (tailor) await updateTailorProfile(tailor.id, { avatar });
      }
      setIsOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Profile photo could not be updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;

    setIsSaving(true);
    setError('');
    try {
      await saveAvatar(await profileImageFileToDataUrl(file));
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Profile photo could not be updated.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm(isHindi ? 'क्या आप अपनी प्रोफ़ाइल फोटो हटाना चाहते हैं?' : 'Remove your profile photo?')) return;
    await saveAvatar('');
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setError('');
          setIsOpen(open => !open);
        }}
        aria-label={isHindi ? 'प्रोफ़ाइल फोटो विकल्प' : 'Profile photo options'}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`relative overflow-hidden rounded-full border-2 border-white bg-stone-100 shadow-sm ring-1 ring-stone-200 transition hover:ring-pink-300 ${className}`}
      >
        <img src={imageSource(currentUser.avatar)} alt={`${currentUser.name} profile`} className="h-full w-full object-cover" />
        <span className="absolute inset-x-0 bottom-0 flex justify-center bg-black/55 py-0.5 text-white">
          {isSaving ? <LoaderCircle className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
        </span>
      </button>

      {isOpen && (
        <div role="menu" className="absolute right-0 top-full z-[60] mt-2 w-56 rounded-xl border border-stone-200 bg-white p-2 text-left shadow-xl">
          <p className="px-2 py-1.5 text-xs font-bold text-stone-700">
            {isHindi ? 'प्रोफ़ाइल फोटो' : 'Profile photo'}
          </p>
          <button
            type="button"
            role="menuitem"
            onClick={() => fileInput.current?.click()}
            disabled={isSaving}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-stone-700 transition hover:bg-pink-50 hover:text-[#D9538C] disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            {isHindi ? 'गैलरी से फोटो चुनें' : 'Choose photo from gallery'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => void handleRemove()}
            disabled={isSaving || !currentUser.avatar}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            {isHindi ? 'फोटो हटाएँ' : 'Remove photo'}
          </button>
          {error && <p role="alert" className="px-2 pb-1 pt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelected}
        className="sr-only"
        aria-label={isHindi ? 'गैलरी से प्रोफ़ाइल फोटो चुनें' : 'Choose profile photo from gallery'}
      />
    </div>
  );
};
