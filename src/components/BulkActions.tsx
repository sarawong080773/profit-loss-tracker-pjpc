import React from 'react';
import { Trash2, Archive, X, AlertTriangle } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onArchive: () => void;
  onCancel: () => void;
}

export default function BulkActions({ selectedCount, onDelete, onArchive, onCancel }: BulkActionsProps) {
  return (
    <div className="bg-indigo-50 border-b border-indigo-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{selectedCount}</span>
            </div>
            <span className="text-indigo-800 font-medium">
              {selectedCount} {selectedCount === 1 ? 'category' : 'categories'} selected
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onArchive}
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
          
          <button
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}