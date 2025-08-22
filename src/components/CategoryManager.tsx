import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  ChevronRight,
  Move,
  Check,
  X,
  AlertTriangle,
  Palette,
  Tag,
  FolderPlus,
  MoreVertical,
  Copy,
  Archive
} from 'lucide-react';
import { CategoryData, CategoryFormData } from '../types/category';
import CategoryForm from './CategoryForm';
import CategoryCard from './CategoryCard';
import CategoryHierarchy from './CategoryHierarchy';
import BulkActions from './BulkActions';

interface CategoryManagerProps {
  categories: CategoryData[];
  onUpdateCategories: (categories: CategoryData[]) => void;
}

export default function CategoryManager({ categories, onUpdateCategories }: CategoryManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'hierarchy'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and search categories
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || category.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle category creation
  const handleCreateCategory = async (formData: CategoryFormData) => {
    setIsLoading(true);
    try {
      const newCategory: CategoryData = {
        id: crypto.randomUUID(),
        name: formData.name,
        type: formData.type,
        color: formData.color,
        icon: formData.icon,
        description: formData.description,
        parentId: formData.parentId,
        order: categories.length,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onUpdateCategories([...categories, newCategory]);
      setShowForm(false);
      
      // Show success animation
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Error creating category:', error);
      setIsLoading(false);
    }
  };

  // Handle category editing
  const handleEditCategory = async (formData: CategoryFormData) => {
    if (!editingCategory) return;
    
    setIsLoading(true);
    try {
      const updatedCategory: CategoryData = {
        ...editingCategory,
        name: formData.name,
        type: formData.type,
        color: formData.color,
        icon: formData.icon,
        description: formData.description,
        parentId: formData.parentId,
        updatedAt: new Date().toISOString()
      };

      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id ? updatedCategory : cat
      );
      
      onUpdateCategories(updatedCategories);
      setEditingCategory(null);
      
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Error updating category:', error);
      setIsLoading(false);
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onUpdateCategories(updatedCategories);
      setShowDeleteConfirm(null);
      
      setTimeout(() => setIsLoading(false), 300);
    } catch (error) {
      console.error('Error deleting category:', error);
      setIsLoading(false);
    }
  };

  // Handle drag and drop reordering
  const handleDragStart = (categoryId: string) => {
    setDraggedCategory(categoryId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetCategoryId: string) => {
    if (!draggedCategory || draggedCategory === targetCategoryId) return;

    const draggedIndex = categories.findIndex(cat => cat.id === draggedCategory);
    const targetIndex = categories.findIndex(cat => cat.id === targetCategoryId);

    const reorderedCategories = [...categories];
    const [draggedItem] = reorderedCategories.splice(draggedIndex, 1);
    reorderedCategories.splice(targetIndex, 0, draggedItem);

    // Update order values
    const updatedCategories = reorderedCategories.map((cat, index) => ({
      ...cat,
      order: index
    }));

    onUpdateCategories(updatedCategories);
    setDraggedCategory(null);
  };

  // Handle bulk selection
  const handleSelectCategory = (categoryId: string) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId);
    } else {
      newSelection.add(categoryId);
    }
    setSelectedCategories(newSelection);
    setShowBulkActions(newSelection.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedCategories.size === filteredCategories.length) {
      setSelectedCategories(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedCategories(new Set(filteredCategories.map(cat => cat.id)));
      setShowBulkActions(true);
    }
  };

  // Handle bulk operations
  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedCategories.size} selected categories?`)) {
      setIsLoading(true);
      const updatedCategories = categories.filter(cat => !selectedCategories.has(cat.id));
      onUpdateCategories(updatedCategories);
      setSelectedCategories(new Set());
      setShowBulkActions(false);
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const handleBulkArchive = async () => {
    setIsLoading(true);
    const updatedCategories = categories.map(cat => 
      selectedCategories.has(cat.id) ? { ...cat, isActive: false } : cat
    );
    onUpdateCategories(updatedCategories);
    setSelectedCategories(new Set());
    setShowBulkActions(false);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            searchInputRef.current?.focus();
            break;
          case 'n':
            e.preventDefault();
            setShowForm(true);
            break;
          case 'a':
            e.preventDefault();
            handleSelectAll();
            break;
        }
      }
      if (e.key === 'Escape') {
        setShowForm(false);
        setEditingCategory(null);
        setShowDeleteConfirm(null);
        setSelectedCategories(new Set());
        setShowBulkActions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCategories.size, filteredCategories.length]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
              <p className="text-gray-600">Organize and customize your transaction categories</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search categories... (Ctrl+K)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${
                  viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${
                  viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('hierarchy')}
                className={`p-3 transition-colors ${
                  viewMode === 'hierarchy' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'
                }`}
                title="Hierarchy view"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
          <span>{categories.length} total categories</span>
          <span>{categories.filter(c => c.type === 'income').length} income</span>
          <span>{categories.filter(c => c.type === 'expense').length} expense</span>
          {selectedCategories.size > 0 && (
            <span className="text-indigo-600 font-medium">
              {selectedCategories.size} selected
            </span>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <BulkActions
          selectedCount={selectedCategories.size}
          onDelete={handleBulkDelete}
          onArchive={handleBulkArchive}
          onCancel={() => {
            setSelectedCategories(new Set());
            setShowBulkActions(false);
          }}
        />
      )}

      {/* Content */}
      <div className="p-6">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-3">Processing...</p>
            </div>
          </div>
        )}

        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm || filterType !== 'all' ? 'No categories found' : 'No categories yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first category to get started'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Category
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Select All Checkbox */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.size === filteredCategories.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">
                  Select all ({filteredCategories.length})
                </span>
              </label>
            </div>

            {/* Category Display */}
            {viewMode === 'hierarchy' ? (
              <CategoryHierarchy
                categories={filteredCategories}
                selectedCategories={selectedCategories}
                onSelectCategory={handleSelectCategory}
                onEditCategory={setEditingCategory}
                onDeleteCategory={setShowDeleteConfirm}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                draggedCategory={draggedCategory}
              />
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-3'
              }>
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    viewMode={viewMode}
                    isSelected={selectedCategories.has(category.id)}
                    onSelect={() => handleSelectCategory(category.id)}
                    onEdit={() => setEditingCategory(category)}
                    onDelete={() => setShowDeleteConfirm(category.id)}
                    onDragStart={() => handleDragStart(category.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(category.id)}
                    isDragged={draggedCategory === category.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Category Form Modal */}
      {(showForm || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CategoryForm
              category={editingCategory}
              categories={categories}
              onSubmit={editingCategory ? handleEditCategory : handleCreateCategory}
              onCancel={() => {
                setShowForm(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Delete Category</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDeleteCategory(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}