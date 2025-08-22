import React, { useRef, useEffect } from 'react';
import { 
  Tag, Folder, DollarSign, Home, Car, Utensils, ShoppingBag, 
  Briefcase, Heart, Music, Camera, Book, Gamepad2, Plane,
  Coffee, Gift, Shirt, Phone, Laptop, Wrench, Palette,
  Star, Target, Trophy, Zap, Shield, Clock, MapPin
} from 'lucide-react';

interface IconPickerProps {
  selectedIcon: string;
  color: string;
  onIconSelect: (icon: string) => void;
  onClose: () => void;
}

const availableIcons = [
  { name: 'Tag', component: Tag },
  { name: 'Folder', component: Folder },
  { name: 'DollarSign', component: DollarSign },
  { name: 'Home', component: Home },
  { name: 'Car', component: Car },
  { name: 'Utensils', component: Utensils },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Heart', component: Heart },
  { name: 'Music', component: Music },
  { name: 'Camera', component: Camera },
  { name: 'Book', component: Book },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Plane', component: Plane },
  { name: 'Coffee', component: Coffee },
  { name: 'Gift', component: Gift },
  { name: 'Shirt', component: Shirt },
  { name: 'Phone', component: Phone },
  { name: 'Laptop', component: Laptop },
  { name: 'Wrench', component: Wrench },
  { name: 'Palette', component: Palette },
  { name: 'Star', component: Star },
  { name: 'Target', component: Target },
  { name: 'Trophy', component: Trophy },
  { name: 'Zap', component: Zap },
  { name: 'Shield', component: Shield },
  { name: 'Clock', component: Clock },
  { name: 'MapPin', component: MapPin }
];

export default function IconPicker({ selectedIcon, color, onIconSelect, onClose }: IconPickerProps) {
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
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto"
    >
      <h4 className="text-sm font-medium text-gray-700 mb-3">Choose an icon</h4>
      
      <div className="grid grid-cols-6 gap-2">
        {availableIcons.map(({ name, component: IconComponent }) => (
          <button
            key={name}
            onClick={() => onIconSelect(name)}
            className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedIcon === name
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            title={name}
          >
            <IconComponent 
              className="w-5 h-5 mx-auto" 
              style={{ color: selectedIcon === name ? color : '#6B7280' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}