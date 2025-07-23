import React from 'react'

export const SimpleTextBlock: React.FC<any> = (props) => {
  const { content, title, disableContainer } = props

  return (
    <div className={!disableContainer ? 'container mx-auto py-8 px-4' : ''}>
      <div className="w-full max-w-4xl mx-auto">
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        )}
        {content && (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">{content}</p>
          </div>
        )}
      </div>
    </div>
  )
}