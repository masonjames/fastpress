import React, { useState } from 'react'
import { getAvailableBlocks } from '../blocks/configRegistry'

interface BlockType {
  id: string
  label: string
  description: string
  icon: string
  category: 'content' | 'layout' | 'media' | 'data'
}

const availableBlocks: BlockType[] = getAvailableBlocks()

interface BlockPickerProps {
  onBlockSelect: (blockType: string) => void
  onClose: () => void
  isOpen: boolean
}

export const BlockPicker: React.FC<BlockPickerProps> = ({ onBlockSelect, onClose, isOpen }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (!isOpen) return null

  const categories = [
    { id: 'all', label: 'All Blocks', icon: '🔧' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'media', label: 'Media', icon: '🖼️' },
    { id: 'data', label: 'Data', icon: '📊' }
  ]

  const filteredBlocks = availableBlocks.filter(block => {
    const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory
    const matchesSearch = block.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         block.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleBlockSelect = (blockType: string) => {
    onBlockSelect(blockType)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Block</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a block to add to your content</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-48 bg-gray-50 border-r">
            <div className="p-4">
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <nav className="px-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg mb-1 transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Block Grid */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {filteredBlocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleBlockSelect(block.id)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{block.icon}</span>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                        {block.label}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600">{block.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No blocks match "${searchTerm}"`
                    : 'No blocks available in this category'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {filteredBlocks.length} block{filteredBlocks.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}