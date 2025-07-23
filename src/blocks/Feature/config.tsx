import { icon } from '../../components/Icon/config'
import { linkGroup } from '../../fields/linkGroup'
import { link } from '../../fields/link'
import { createBlockItemCondition } from '../../utilities/findParentFeatureVersion'

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
import { designVersionDescription } from '../../components/AdminDashboard/DesignVersionDescription'
import { designVersionPreview } from '../../components/AdminDashboard/DesignVersionPreview/config'
import { backgroundColor } from '../../fields/color'

export const allFeatureDesignVersions = [
  { label: 'FEATURE1', value: 'FEATURE1', image: '/admin/previews/feature/feature1.jpeg' },
  // 'FEATURE2',
  // 'FEATURE3',
  // 'FEATURE4',
  // 'FEATURE5',
  // 'FEATURE6',
  // 'FEATURE7',
  // 'FEATURE8',
  // 'FEATURE9',
  // 'FEATURE10',
  // 'FEATURE11',
  // 'FEATURE12',
  // 'FEATURE13',
  // 'FEATURE14',
  // 'FEATURE15',
  // 'FEATURE16',
  // 'FEATURE17',
  // 'FEATURE18',
  // 'FEATURE19',
  // 'FEATURE20',
  // 'FEATURE21',
  // 'FEATURE22',
  // 'FEATURE23',
  // 'FEATURE24',
  { label: 'FEATURE25', value: 'FEATURE25', image: '/admin/previews/feature/feature25.jpeg' },
  // 'FEATURE26',
  // 'FEATURE27',
  // 'FEATURE28',
  // 'FEATURE29',
  // 'FEATURE30',
  // 'FEATURE31',
  // 'FEATURE32',
  // 'FEATURE33',
  // 'FEATURE34',
  // 'FEATURE35',
  // 'FEATURE36',
  // 'FEATURE37',
  // 'FEATURE38',
  // 'FEATURE39',
  // 'FEATURE41',
  // 'FEATURE42',
  // 'FEATURE43',
  // 'FEATURE44',
  { label: 'FEATURE50', value: 'FEATURE50', image: '/admin/previews/feature/feature50.jpeg' },
  // 'FEATURE51',
  // 'FEATURE52',
  { label: 'FEATURE53', value: 'FEATURE53', image: '/admin/previews/feature/feature53.jpeg' },
  // 'FEATURE54',
  // 'FEATURE55',
  // 'FEATURE56',
  { label: 'FEATURE57', value: 'FEATURE57', image: '/admin/previews/feature/feature57.jpg' },
  // 'FEATURE58',
  // 'FEATURE59',
  // 'FEATURE60',
  // 'FEATURE61',
  // 'FEATURE62',
  // 'FEATURE63',
  // 'FEATURE64',
  // 'FEATURE65',
  // 'FEATURE66',
  // 'FEATURE67',
  // 'FEATURE68',
  // 'FEATURE69',
  { label: 'FEATURE70', value: 'FEATURE70', image: '/admin/previews/feature/feature70.jpeg' },
  // 'FEATURE71',
  { label: 'FEATURE72', value: 'FEATURE72', image: '/admin/previews/feature/feature72.jpeg' },
  // 'FEATURE73',
  // 'FEATURE74',
  // 'FEATURE75',
  // 'FEATURE76',
  // 'FEATURE77',
  // 'FEATURE78',
  // 'FEATURE79',
  // 'FEATURE80',
  // 'FEATURE81',
  // 'FEATURE82',
  // 'FEATURE83',
  // 'FEATURE85',
  // 'FEATURE86',
  // 'FEATURE87',
  // 'FEATURE89',
  // 'FEATURE90',
  { label: 'FEATURE91', value: 'FEATURE91', image: '/admin/previews/feature/feature91.jpeg' },
  // 'FEATURE92',
  // 'FEATURE93',
  // 'FEATURE94',
  // 'FEATURE95',
  { label: 'FEATURE97', value: 'FEATURE97', image: '/admin/previews/feature/feature97.jpeg' },
  // 'FEATURE98',
  { label: 'FEATURE99', value: 'FEATURE99', image: '/admin/previews/feature/feature99.jpeg' },
  // 'FEATURE101',
  { label: 'FEATURE102', value: 'FEATURE102', image: '/admin/previews/feature/feature102.jpeg' },
  { label: 'FEATURE103', value: 'FEATURE103', image: '/admin/previews/feature/feature103.jpeg' },
  // 'FEATURE104',
  // 'FEATURE105',
  // 'FEATURE106',
  // 'FEATURE107',
  // 'FEATURE108',
  // 'FEATURE109',
  { label: 'FEATURE114', value: 'FEATURE114', image: '/admin/previews/feature/feature114.jpeg' },
  { label: 'FEATURE117', value: 'FEATURE117', image: '/admin/previews/feature/feature117.jpeg' },
  { label: 'FEATURE126', value: 'FEATURE126', image: '/admin/previews/feature/feature126.jpeg' },
] as const

export type FeatureDesignVersion = (typeof allFeatureDesignVersions)[number]


/**
 * The Feature block is the shadcnblocks.com feature block integrated in payload.
 * It is using the same field namings as the heros -> PageHero
 */
export const FeatureBlock: Block = {
  slug: 'feature',
  interfaceName: 'FeatureBlock',
  fields: [
    backgroundColor,
    designVersionPreview(allFeatureDesignVersions),
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['FEATURE1', 'FEATURE2', 'FEATURE3', 'FEATURE4', 'FEATURE5', 'FEATURE6','FEATURE57', 'FEATURE126'].includes(
            designVersion,
          ),
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['FEATURE99', 'FEATURE103', 'FEATURE25'].includes(designVersion),
      },
    },
    icon({
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          [
            'FEATURE1',
            'FEATURE2',
            'FEATURE20',
            'FEATURE21',
            'FEATURE24',
            'FEATURE38',
            'FEATURE6',
            'FEATURE7',
          ].includes(designVersion),
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ![
            'FEATURE14',
            'FEATURE28',
            'FEATURE37',
            'FEATURE5',
            'FEATURE51',
            'FEATURE52',
            'FEATURE53',
            'FEATURE56',
            'FEATURE58',
            'FEATURE59',
            'FEATURE62',
            'FEATURE106',
            'FEATURE91',
          ].includes(designVersion),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { designVersion = "" } = {}) =>
            [
              'FEATURE1',
              'FEATURE2',
              'FEATURE11',
              'FEATURE38',
              'FEATURE50',
              'FEATURE71',
              'FEATURE72',
              'FEATURE73',
              'FEATURE74',
              'FEATURE78',
              'FEATURE80',
              'FEATURE82',
              'FEATURE86',
              'FEATURE90',
              'FEATURE94',
              'FEATURE97',
              'FEATURE98',
              'FEATURE109',
              'FEATURE114',
              'FEATURE126',
            ].includes(designVersion),
        },
      },
    }),
    {
      /**
       * some Features have just one single image
       */
      name: 'image',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          [
            'FEATURE1',
            'FEATURE95',
            'FEATURE87',
            'FEATURE11',
            'FEATURE2',
            'FEATURE24',
            'FEATURE33',
            'FEATURE38',
            'FEATURE58',
          ].includes(designVersion),
      },
      relationTo: 'media',
      hasMany: false,
    },

    designVersionDescription(
      'description3',
      (_, { designVersion } = {}) => ['FEATURE3'].includes(designVersion),
      {
        en: 'You have feature 3 selected',
        de: 'Du hast feature 3 ausgewählt',
      },
    ),
    designVersionDescription(
      'description91',
      (_, { designVersion } = {}) => ['FEATURE91'].includes(designVersion),
      {
        en: 'You need to have exactly two USPs for FEATURE 91 block to work',
        de: 'Du musst genau zwei USPs haben, damit dieser Block funktioniert',
      },
    ),

    /**
     * multiple images
     */
    {
      name: 'images',
      label: 'Images / Avatars',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['FEATURE114'].includes(designVersion),
      },
      relationTo: 'media',
      hasMany: true,
    },

    /**
     * Metrics with optional subline
     */
    {
      name: 'metrics',
      type: 'array',
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ['FEATURE114', 'FEATURE120', 'FEATURE136'].includes(designVersion),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'subline',
          type: 'text',
          localized: true,
        },
      ],
    },

    {
      name: 'USPs',
      type: 'array',
      admin: {
        condition: (_, { designVersion = "" } = {}) =>
          ![
            'FEATURE1',
            'FEATURE2',
            'FEATURE6',
            'FEATURE7',
            'FEATURE11',
            'FEATURE24',
            'FEATURE30',
            'FEATURE38',
            'FEATURE55',
            'FEATURE60',
            'FEATURE80',
            'FEATURE86',
            'FEATURE90',
          ].includes(designVersion),
      },
      fields: [
        icon({
          label: 'Icon',
          name: 'uspIcon',
          admin: {
            condition: (data, _) => {
              const designVersion = data.layout.find(
                (block) => block.blockType === 'feature',
              ).designVersion
              return [
                'FEATURE4',
                'FEATURE5',
                'FEATURE15',
                'FEATURE16',
                'FEATURE26',
                'FEATURE51',
                'FEATURE52',
                'FEATURE57',
                'FEATURE58',
                'FEATURE67',
                'FEATURE76',
                'FEATURE83',
                'FEATURE85',
                'FEATURE89',
                'FEATURE93',
                'FEATURE97',
                'FEATURE101',
                'FEATURE104',
                'FEATURE105',
                'FEATURE106',
                'FEATURE107',
                'FEATURE108',
                'FEATURE114',
                'FEATURE117',
              ].includes(designVersion)
            },
          },
        }),
        /**
         * Single tagline per USP, for example for feature117
         */
        {
          name: 'tagline',
          type: 'text',
          localized: true,
          admin: {
            // conditions on sibling fields are unfortunatly currently not possible in payload

          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {

          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                ParagraphFeature(),
                OrderedListFeature(),
                UnorderedListFeature(),
              ]
            },
          }),
          label: false,
        },
        /**
         * USPs can have 1 or many features, with icon and richText. only features 19, 22, 25, 91 have this
         */
        {
          name: 'USPFeatures',
          type: 'array',
          admin: {
            description: 'USPs can feature 1 or many features, with icon and richText',
            condition: (data, siblingData) => {
              // Get all feature blocks
              const featureBlocks = data.layout?.filter(
                (block) => block.blockType === 'feature'
              ) || []

              // Find the feature block that contains our current USP
              const currentFeatureBlock = featureBlocks.find(block =>
                block.USPs?.some(usp =>
                  // Compare USP fields to identify the current one
                  usp.tagline === siblingData.tagline &&
                  usp.image === siblingData.image
                )
              )

              return currentFeatureBlock && ['FEATURE19', 'FEATURE22', 'FEATURE25', 'FEATURE91'].includes(currentFeatureBlock.designVersion)
            },
          },
          fields: [
            icon({
              admin: {
                condition: (data, siblingData) => {
                  // Get all feature blocks
                  const featureBlocks = data.layout?.filter(
                    (block) => block.blockType === 'feature'
                  ) || []

                  // Find the feature block that contains our current USP
                  const currentFeatureBlock = featureBlocks.find(block =>
                    block.USPs?.some(usp =>
                      // Compare USP fields to identify the current one
                      usp.tagline === siblingData.tagline &&
                      usp.image === siblingData.image
                    )
                  )

                  // Show icon for all features except feature25
                  return currentFeatureBlock && !['FEATURE25'].includes(currentFeatureBlock.designVersion)
                },
              },
            }),
            {
              name: 'richText',
              type: 'richText',
              localized: true,
            },
          ],
        },
        linkGroup({
          overrides: {
            maxRows: 2,
            admin: {
              condition: (data, _) => {
                const designVersion = data.layout.find(
                  (block) => block.blockType === 'feature',
                ).designVersion
                return ['FEATURE70', 'FEATURE91'].includes(designVersion)
              },
            },
          },
        }),
        /**
         * Just a single link
         */
        link({
          appearances: false,
          overrides: {
            admin: {
              description:
                'Single link for this USP. Icons might be set automatically, depending on the design version',
              condition: (data, _) => {
                const designVersion = data.layout.find(
                  (block) => block.blockType === 'feature',
                ).designVersion
                return ['FEATURE103', 'FEATURE117'].includes(designVersion)
              },
            },
          },
        }),
        /**
         * USP images
         */
        {
          name: 'image',
          type: 'upload',
          admin: {
            condition: createBlockItemCondition([
              'FEATURE3',
              'FEATURE50',
              'FEATURE51',
              'FEATURE53',
              'FEATURE57',
              'FEATURE102',
              'FEATURE66',
              'FEATURE70',
              'FEATURE72',
              'FEATURE78',
              'FEATURE81',
              'FEATURE117',
              'FEATURE126',
            ])
          },
          relationTo: 'media',
          hasMany: false,
        },
      ],
      minRows: 1,
    },
  ],
  labels: {
    singular: 'Feature',
    plural: 'Features',
  },
}
