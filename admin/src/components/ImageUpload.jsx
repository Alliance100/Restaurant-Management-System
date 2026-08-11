import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import api from '../api/axios';

/**
 * ImageUpload — click to pick or drag-and-drop
 * Props:
 *   value: string (current image URL)
 *   onChange: (url: string) => void
 */
const ImageUpload = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data.imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileInput = (e) => handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const clearImage = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value ? (
        <div className="relative rounded-sm overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
          <img src={value} alt="Preview" className="w-full h-40 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-sm w-7 h-7 flex items-center justify-center shadow transition-all"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          >
            Change
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center h-36 rounded-sm border-2 border-dashed cursor-pointer transition-all select-none
            ${dragOver
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
              : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 hover:border-orange-400 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
        >
          {uploading ? (
            <Loader className="w-7 h-7 text-orange-500 animate-spin mb-2" />
          ) : (
            <Upload className="w-7 h-7 text-stone-400 mb-2" />
          )}
          <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
            {uploading ? 'Uploading…' : 'Click or drag image here'}
          </p>
          {!uploading && (
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">JPG, PNG, WebP · max 5 MB</p>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <input
          type="url"
          placeholder="Or paste image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-orange-500 transition-all"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileInput} />
    </div>
  );
};

export default ImageUpload;
