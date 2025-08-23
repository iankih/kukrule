import Image from 'next/image'
import { ContentBlock } from '@/lib/supabase'
import { getImageProps } from '@/lib/image-utils'

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
  className?: string
}

export function ContentBlockRenderer({ blocks, className = '' }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={block.id} className="mb-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {block.content}
            </p>
          </div>
        )

      case 'heading':
        return (
          <div key={block.id} className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {block.content}
            </h3>
          </div>
        )

      case 'list':
        if (!block.content) return null
        const listItems = block.content.split('\n').filter(item => item.trim())
        return (
          <div key={block.id} className="mb-4">
            <ul className="space-y-1">
              {listItems.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-primary mr-2 text-xs mt-1">•</span>
                  <span className="flex-1">{item.trim()}</span>
                </li>
              ))}
            </ul>
          </div>
        )

      case 'image':
        if (!block.image_url) return null
        return (
          <div key={block.id} className="mb-6">
            <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <div className="w-full pb-[66.67%]"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image 
                  {...getImageProps(block.image_url, {
                    src: block.image_url,
                    alt: block.image_alt || '제품 설명 이미지',
                    width: 600,
                    height: 400,
                    className: "max-w-full max-h-full object-contain"
                  })}
                />
              </div>
              {block.image_alt && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                  <p className="text-xs text-center">{block.image_alt}</p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        console.warn(`Unknown block type: ${block.type}`)
        return null
    }
  }

  return (
    <div className={`content-block-renderer ${className}`}>
      {blocks.map(renderBlock)}
    </div>
  )
}