interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
  onCategoryClick: (slug: string) => void;
}

export function CategoryList({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  onCategoryClick 
}: CategoryListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category._id} className="flex items-center justify-between">
            <button
              onClick={() => onCategoryClick(category.slug)}
              className="text-gray-700 hover:text-blue-600 transition-colors text-left flex-1"
            >
              {category.name}
            </button>
            <button
              onClick={() => onCategorySelect(category._id)}
              className={`ml-2 px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category._id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {selectedCategory === category._id ? 'Clear' : 'Filter'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
