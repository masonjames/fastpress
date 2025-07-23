import { icon } from '@/components/Icon/config'
import { linkGroup } from '@/fields/linkGroup'
import { link } from '@/fields/link'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { backgroundColor, color } from '@/fields/color'

export const allCtaDesignVersions = [
  'CTA1',
  // 'CTA3',
  // 'CTA4',
  // 'CTA5',
  'CTA6',
  // 'CTA7',
  'CTA10',
  // 'CTA11',
  // 'CTA12',
  // 'CTA13',
  // 'CTA15',
  // 'CTA16',
  // 'CTA17',
] as const

export type CtaDesignVersion = typeof allCtaDesignVersions[number]

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allCtaDesignVersions.map(version => ({ label: version, value: version })),
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['CTA3', 'CTA4', 'CTA7', 'CTA13', 'CTA15'].includes(designVersion),
      },
    },
    icon({
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['CTA1', 'CTA6', 'CTA7', 'CTA13', 'CTA15'].includes(designVersion),
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['CTA1', 'CTA3', 'CTA4', 'CTA5', 'CTA6', 'CTA7', 'CTA10', 'CTA11', 'CTA12', 'CTA13', 'CTA15', 'CTA16'].includes(
            designVersion,
          ),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          ParagraphFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { designVersion = "" } = {}) =>
            allCtaDesignVersions.includes(designVersion), // All CTAs use links
        },
      },
    }),
    {
      name: 'image',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['CTA1', 'CTA4', 'CTA6', 'CTA7', 'CTA13', 'CTA15', 'CTA16'].includes(designVersion),
      },
      relationTo: 'media',
      required: false,
    },
  ],
}