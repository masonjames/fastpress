import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import {
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const allLogosDesignVersions = [
  'LOGOS2',
  'LOGOS3',
] as const

export type LogosDesignVersion = typeof allLogosDesignVersions[number]

export const LogosBlock: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  labels: {
    singular: 'Logos',
    plural: 'multiple Logos',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allLogosDesignVersions.map(version => ({ label: version, value: version })),
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] })
        ],
      }),
    },


    link({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['LOGOS2'].includes(designVersion),
        },
      }
    }),

    {
      name: 'logos',
      type: 'upload',
      relationTo: 'media',
      required: true,
      minRows: 6,
      hasMany: true,
    },
  ],
}