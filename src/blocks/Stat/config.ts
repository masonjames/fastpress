import { backgroundColor } from '@/fields/color'
import { linkGroup } from '@/fields/linkGroup'
import {
  HeadingFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const allStatDesignVersions = [
  'STAT1',
  // 'STAT2',
  // 'STAT4',
  // 'STAT5',
  // 'STAT6',
  // 'STAT7',
  // 'STAT8',
] as const

export type StatDesignVersion = (typeof allStatDesignVersions)[number]

export const StatBlock: Block = {
  slug: 'stat',
  interfaceName: 'StatBlock',
  labels: {
    singular: 'Stat',
    plural: 'Stats',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allStatDesignVersions.map((version) => ({ label: version, value: version })),
    },
    {
      name: 'headline',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'counter',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['STAT6', 'STAT8'].includes(designVersion),
        },
      }
    })
  ],
}
