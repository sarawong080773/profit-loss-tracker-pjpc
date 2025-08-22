import React from 'react';
import { Edit3, Trash2, Move, MoreVertical, Tag, Folder } from 'lucide-react';
import { CategoryData } from '../types/category';

interface CategoryCardProps {
  category: CategoryData;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isDragged: boolean;
}

export default function CategoryCard({
  category,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragged
}: CategoryCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`group flex items-center gap-4 p-4 bg-white border rounded-lg transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-indigo-500 border-indigo-200' : 'border-gray-200'
        } ${isDragged ? 'opacity-50 scale-95' : 'hover:-translate-y-0.5'}`}
      >
        {/* Selection Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />

        {/* Drag Handle */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <Move className="w-4 h-4 text-gray-400" />
        </div>

        {/* Category Icon */}
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.parentId ? (
            <Folder className="w-6 h-6" style={{ color: category.color }} />
          ) : (
            <Tag className="w-6 h-6" style={{ color: category.color }} />
          )}
        </div>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800 truncate">{category.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              category.type === 'income' 
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {category.type}
            </span>
            {!category.isActive && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                Archived
              </span>
            )}
          </div>
          {category.description && (
            <p className="text-sm text-gray-600 truncate">{category.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Created {formatDate(category.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit category"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`group relative bg-white border rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'ring-2 ring-indigo-500 border-indigo-200' : 'border-gray-200'
      } ${isDragged ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>

      {/* Drag Handle */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
        <Move className="w-4 h-4 text-gray-400" />
      </div>

      {/* Category Icon */}
      <div className="flex justify-center mb-4 mt-2">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${category.color}20` }}
        >
          {category.parentId ? (
            <Folder className="w-8 h-8" style={{ color: category.color }} />
          ) : (
            <Tag className="w-8 h-8" style={{ color: category.color }} />
          )}
        </div>
      </div>

      {/* Category Info */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 truncate">{category.name}</h3>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            category.type === 'income' 
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {category.type}
          </span>
          {!category.isActive && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              Archived
            </span>
          )}
        </div>

        {category.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{category.description}</p>
        )}
        
        <p className="text-xs text-gray-500">
          Created {formatDate(category.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}