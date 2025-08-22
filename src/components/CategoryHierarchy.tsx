import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, Tag, Edit3, Trash2, Move } from 'lucide-react';
import { CategoryData } from '../types/category';

interface CategoryHierarchyProps {
  categories: CategoryData[];
  selectedCategories: Set<string>;
  onSelectCategory: (id: string) => void;
  onEditCategory: (category: CategoryData) => void;
  onDeleteCategory: (id: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: string) => void;
  draggedCategory: string | null;
}

export default function CategoryHierarchy({
  categories,
  selectedCategories,
  onSelectCategory,
  onEditCategory,
  onDeleteCategory,
  onDragStart,
  onDragOver,
  onDrop,
  draggedCategory
}: CategoryHierarchyProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Organize categories into hierarchy
  const rootCategories = categories.filter(cat => !cat.parentId);
  const getChildren = (parentId: string) => categories.filter(cat => cat.parentId === parentId);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CategoryItem = ({ category, level = 0 }: { category: CategoryData; level?: number }) => {
    const children = getChildren(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategories.has(category.id);
    const isDragged = draggedCategory === category.id;

    return (
      <div className="select-none">
        <div
          draggable
          onDragStart={() => onDragStart(category.id)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(category.id)}
          className={`group flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
            isSelected ? 'bg-indigo-50 border border-indigo-200' : ''
          } ${isDragged ? 'opacity-50 scale-95' : ''}`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse Button */}
          <button
            onClick={() => toggleExpanded(category.id)}
            className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
              hasChildren ? 'hover:bg-gray-200' : 'invisible'
            }`}
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )
            )}
          </button>

          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelectCategory(category.id)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />

          {/* Drag Handle */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <Move className="w-4 h-4 text-gray-400" />
          </div>

          {/* Category Icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category.color}20` }}
          >
            {level > 0 ? (
              <Folder className="w-4 h-4" style={{ color: category.color }} />
            ) : (
              <Tag className="w-4 h-4" style={{ color: category.color }} />
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-800 truncate">{category.name}</h3>
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
              {hasChildren && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {children.length} {children.length === 1 ? 'child' : 'children'}
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 truncate">{category.description}</p>
            )}
            <p className="text-xs text-gray-500">
              Created {formatDate(category.createdAt)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditCategory(category)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit category"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-6 border-l-2 border-gray-100">
            {children.map((child) => (
              <CategoryItem key={child.id} category={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {rootCategories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}