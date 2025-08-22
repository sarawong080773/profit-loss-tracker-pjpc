import React, { useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const predefinedColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#F43F5E', '#8B5A2B', '#6B7280', '#1F2937',
  '#7C3AED', '#DC2626', '#059669', '#D97706', '#4F46E5'
];

export default function ColorPicker({ selectedColor, onColorSelect, onClose }: ColorPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64"
    >
      <h4 className="text-sm font-medium text-gray-700 mb-3">Choose a color</h4>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {predefinedColors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className="relative w-10 h-10 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
            )}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-3">
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Custom Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => onColorSelect(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}