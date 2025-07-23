import React, { useState } from 'react'
import { BlockPicker } from './BlockPicker'
import { BlockEditor } from './BlockEditor'
import { createDefaultBlock } from '../blocks/configRegistry'

interface BlockArrayFieldProps {
  label: string
  value: any[]
  onChange: (blocks: any[]) => void
  className?: string
}

export const BlockArrayField: React.FC<BlockArrayFieldProps> = ({
  label,
  value,
  onChange,
  className = ''
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const blocks = value || []

  const handleAddBlock = (blockType: string) => {
    const newBlock = createDefaultBlock(blockType)
    if (newBlock) {
      onChange([...blocks, newBlock])
    }
  }

  const handleUpdateBlock = (index: number, updatedBlock: any) => {
    const newBlocks = [...blocks]
    newBlocks[index] = updatedBlock
    onChange(newBlocks)
  }

  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index)
    onChange(newBlocks)
  }

  const handleMoveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return
    
    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    onChange(newBlocks)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Block
        </button>
      </div>

      {/* Block List */}
      {blocks.length > 0 ? (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id || index}
              block={block}
              onUpdate={(updatedBlock) => handleUpdateBlock(index, updatedBlock)}
              onDelete={() => handleDeleteBlock(index)}
              onMoveUp={() => handleMoveBlock(index, index - 1)}
              onMoveDown={() => handleMoveBlock(index, index + 1)}
              canMoveUp={index > 0}
              canMoveDown={index < blocks.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks yet</h3>
          <p className="text-gray-600 mb-4">
            Add your first block to start building your content
          </p>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Block
          </button>
        </div>
      )}

      {/* Block Count */}
      {blocks.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''} total
        </div>
      )}

      {/* Block Picker Modal */}
      <BlockPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onBlockSelect={handleAddBlock}
      />
    </div>
  )
}