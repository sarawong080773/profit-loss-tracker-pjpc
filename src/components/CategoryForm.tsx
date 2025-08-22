import React, { useState, useEffect } from 'react';
import { X, Palette, Tag, FileText, Folder, Check } from 'lucide-react';
import { CategoryData, CategoryFormData } from '../types/category';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';

interface CategoryFormProps {
  category?: CategoryData | null;
  categories: CategoryData[];
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

const defaultColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

export default function CategoryForm({ category, categories, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: defaultColors[0],
    icon: 'Tag',
    description: '',
    parentId: undefined
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
        icon: category.icon,
        description: category.description || '',
        parentId: category.parentId
      });
    }
  }, [category]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Category name must be less than 50 characters';
    }

    // Check for duplicate names (excluding current category if editing)
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase() && 
      cat.id !== category?.id
    );
    if (existingCategory) {
      newErrors.name = 'A category with this name already exists';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleColorSelect = (color: string) => {
    setFormData({ ...formData, color });
    setShowColorPicker(false);
  };

  const handleIconSelect = (icon: string) => {
    setFormData({ ...formData, icon });
    setShowIconPicker(false);
  };

  // Get available parent categories (exclude current category and its children)
  const availableParents = categories.filter(cat => {
    if (category && cat.id === category.id) return false;
    if (category && cat.parentId === category.id) return false;
    return cat.type === formData.type;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {category ? 'Edit Category' : 'Create New Category'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter category name"
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Category Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Type *
          </label>
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'income', parentId: undefined })}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'expense', parentId: undefined })}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Parent Category */}
        {availableParents.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category (Optional)
            </label>
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">No parent (top-level category)</option>
              {availableParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Color and Icon Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-gray-700">{formData.color}</span>
                <Palette className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
              
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <ColorPicker
                    selectedColor={formData.color}
                    onColorSelect={handleColorSelect}
                    onClose={() => setShowColorPicker(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIconPicker(!showIconPicker)}
                className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Tag className="w-5 h-5" style={{ color: formData.color }} />
                <span className="text-gray-700">{formData.icon}</span>
                <FileText className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
              
              {showIconPicker && (
                <div className="absolute top-full left-0 mt-2 z-10">
                  <IconPicker
                    selectedIcon={formData.icon}
                    color={formData.color}
                    onIconSelect={handleIconSelect}
                    onClose={() => setShowIconPicker(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Add a description for this category"
            rows={3}
            maxLength={200}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${formData.color}20`, color: formData.color }}
            >
              <Tag className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">
                {formData.name || 'Category Name'}
              </div>
              {formData.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {formData.description}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  formData.type === 'income' 
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {formData.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Check className="w-4 h-4 inline mr-2" />
            {category ? 'Update Category' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}