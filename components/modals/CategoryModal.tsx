
import React, { useState, FormEvent, ChangeEvent } from 'react';
// Fix: Import `Category` type to be used for type annotation.
import { Categories, Category } from '../../types';
import { saveCategories } from '../../services/firebaseService';
import { DEFAULT_CATEGORIES, GENERIC_ICON } from '../../constants';
import ModalWrapper from './ModalWrapper';
import GlassInput from '../shared/GlassInput';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  categories: Categories;
  showToast: (message: string, isError?: boolean) => void;
  onDeleteRequest: (categoryId: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, appId, categories, showToast, onDeleteRequest }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    // Fix: Explicitly type `c` as `Category` to allow access to `c.label`.
    if (name && !Object.values(categories).some((c: Category) => c.label.toLowerCase() === name.toLowerCase())) {
      const key = name.toLowerCase().replace(/\s+/g, '_');
      const newCategories = {
        ...categories,
        [key]: { label: name, icon: GENERIC_ICON }
      };
      try {
        await saveCategories(appId, newCategories);
        showToast('Category added!');
        setNewCategoryName('');
      } catch (error) {
        showToast('Failed to add category.', true);
      }
    }
  };

  const handleBudgetChange = async (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const budget = parseFloat(e.target.value) || 0;
    if (categories[key]) {
      const newCategories = { ...categories };
      newCategories[key].budget = budget > 0 ? budget : undefined;
      try {
        await saveCategories(appId, newCategories);
        showToast('Category budget updated!');
      } catch (error) {
        showToast('Failed to update budget.', true);
      }
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <GlassInput
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">Add</button>
      </form>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {Object.keys(categories).map(key => {
          const category = categories[key];
          const isDefault = !!DEFAULT_CATEGORIES[key];
          return (
            <div key={key} className="flex items-center justify-between p-2 glass-input rounded-lg gap-2">
              <span className="text-light-text-primary dark:text-dark-text-primary truncate">{category.label}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <GlassInput
                  type="number"
                  className="w-24 text-sm p-1 rounded"
                  placeholder="Budget"
                  value={category.budget || ''}
                  onChange={(e) => handleBudgetChange(e, key)}
                />
                {!isDefault ? (
                  <button onClick={() => onDeleteRequest(key)} className="p-1 text-red-400 hover:text-red-300" title={`Delete ${category.label}`}>&times;</button>
                ) : (
                  <span className="w-6 text-right"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end gap-3 pt-6">
        <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Done</button>
      </div>
    </ModalWrapper>
  );
};

export default CategoryModal;