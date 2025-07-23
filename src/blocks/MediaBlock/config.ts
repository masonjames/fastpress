import { backgroundColor } from '@/fields/color'
import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    backgroundColor,
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      required: false,
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16/9',
      options: [
        {
          label: '16:9',
          value: '16/9',
        },
        {
          label: '4:3',
          value: '4/3',
        },
        {
          label: '1:1',
          value: '1/1',
        },
        {
          label: 'Original',
          value: 'original',
        },
      ],
    },
  ],
}
