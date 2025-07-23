interface BlockField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image'
  required?: boolean
  defaultValue?: any
  placeholder?: string
  options?: { label: string; value: string }[]
}

interface BlockConfig {
  id: string
  label: string
  description: string
  icon: string
  category: 'content' | 'layout' | 'media' | 'data'
  fields: BlockField[]
  defaultProps?: Record<string, any>
}

// Block configurations registry
const blockConfigs: Record<string, BlockConfig> = {
  text: {
    id: 'text',
    label: 'Text',
    description: 'Simple text block with optional title',
    icon: '📝',
    category: 'content',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        placeholder: 'Enter a title (optional)'
      },
      {
        name: 'content',
        label: 'Content',
        type: 'textarea',
        required: true,
        placeholder: 'Enter your text content...'
      }
    ],
    defaultProps: {
      title: '',
      content: '',
      disableContainer: false
    }
  }
}

// Utility functions
export const getBlockConfig = (blockType: string): BlockConfig | undefined => {
  return blockConfigs[blockType]
}

export const getAllBlockConfigs = (): BlockConfig[] => {
  return Object.values(blockConfigs)
}

export const getBlocksByCategory = (category: string): BlockConfig[] => {
  return Object.values(blockConfigs).filter(config => config.category === category)
}

export const createDefaultBlock = (blockType: string): any => {
  const config = getBlockConfig(blockType)
  if (!config) return null

  const block = {
    blockType,
    id: generateBlockId(),
    ...config.defaultProps
  }

  // Set default values from field definitions
  config.fields.forEach(field => {
    if (field.defaultValue !== undefined && !(field.name in block)) {
      block[field.name] = field.defaultValue
    }
  })

  return block
}

export const generateBlockId = (): string => {
  return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const validateBlock = (block: any): { isValid: boolean; errors: string[] } => {
  const config = getBlockConfig(block.blockType)
  if (!config) {
    return { isValid: false, errors: ['Unknown block type'] }
  }

  const errors: string[] = []

  config.fields.forEach(field => {
    if (field.required && (!block[field.name] || block[field.name] === '')) {
      errors.push(`${field.label} is required`)
    }
  })

  return { isValid: errors.length === 0, errors }
}

// Export for use in BlockPicker
export const getAvailableBlocks = () => {
  return getAllBlockConfigs().map(config => ({
    id: config.id,
    label: config.label,
    description: config.description,
    icon: config.icon,
    category: config.category
  }))
}