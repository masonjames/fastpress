import { Block } from 'payload'
import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { FormBlock } from '../Form/config'
import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'

export const allContactDesignVersions = [
  // 'CONTACT1',
  'CONTACT2',
  // 'CONTACT3',
  // 'CONTACT4'
] as const
export type ContactDesignVersion = (typeof allContactDesignVersions)[number]

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contacts',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      defaultValue: 'CONTACT1',
      options: allContactDesignVersions.map((version) => ({ label: version, value: version })),
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          InlineToolbarFeature(),
          ParagraphFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
        ],
      }),
    },
    {
      name: 'contactBlocks',
      type: 'array',
      fields: [
        icon(),
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
    {
      name: 'maps',
      type: 'array',
      fields: [
        {
          name: 'iframe',
          type: 'text',
        },
      ],
    },
    {
      name: 'form',
      label: 'Form',
      type: 'blocks',
      blocks: [FormBlock],
      maxRows: 1,
    },
  ],
}
