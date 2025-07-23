import { Block } from 'payload'
import { HeadingFeature, ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'
import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

export const allGalleryDesignVersions = [
  // 'GALLERY1',
  // 'GALLERY2',
  // 'GALLERY3',
  {
    label: 'Gallery 4 (Large Images with Overlay)',
    value: 'GALLERY4',
    image: '/admin/previews/gallery/gallery4.jpeg',
  },
  {
    label: 'Gallery 5 (Carousel)',
    value: 'GALLERY5',
    image: '/admin/previews/gallery/gallery5.jpeg',
  },
  {
    label: 'Gallery 6 (Card Layout)',
    value: 'GALLERY6',
    image: '/admin/previews/gallery/gallery6.jpeg',
  },
  {
    label: 'Gallery 25 (4 Column Grid)',
    value: 'GALLERY25',
    image: '/admin/previews/gallery/gallery25.webp',
    description:
      'A 4-column animated image gallery, each column with varying image heights and animated transitions on view. (Grid - Number of images should be in multiples of 4)',
  },
  {
    label: 'Gallery 26 (Blur Vignette)',
    value: 'GALLERY26',
    image: '/admin/previews/gallery/gallery26.webp',
  },
] as const

/**
 * mutable copy of allGalleryDesignVersions as payload needs this type
 */
const galleryDesignVersions: string[] = allGalleryDesignVersions.map((item) => item.value)

export type GalleryDesignVersion = (typeof allGalleryDesignVersions)[number]

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Gallery',
    plural: 'Gallery Blocks',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allGalleryDesignVersions),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Optional heading and description for the gallery',
        condition: (_, { designVersion = '' } = {}) =>
          !['GALLERY1', 'GALLERY25', 'GALLERY26'].includes(designVersion),
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          ParagraphFeature(),
        ],
      }),
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['GALLERY6'].includes(designVersion),
      },
    },
    link({
      appearances: false,
      overrides: {
        admin: {
          description: 'Single link for this gallery. Might look best with arrowRight icon',
          condition: (_, { designVersion }: any) => ['GALLERY6'].includes(designVersion),
        },
      },
    }),
    {
      name: 'elements',
      label: 'Gallery Items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add images to the gallery',
        condition: (_, { designVersion = '' } = {}) =>
          galleryDesignVersions.includes(designVersion),
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'imageHeight',
          type: 'select',
          options: [
            '12rem',
            '13rem',
            '14rem',
            '15rem',
            '16rem',
            '17rem',
            '18rem',
            '19rem',
            '20rem',
            '21rem',
            '22rem',
            '23rem',
            '24rem',
            '25rem',
            '26rem',
            '27rem',
            '28rem',
            '29rem',
            '30rem',
            '31rem',
            '32rem',
          ],
          defaultValue: '21rem',
          admin: {
            description: 'Select the height of the image. This is only applicable to Gallery 25.',
            condition: createBlockItemCondition(['GALLERY25']),
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Select an icon to display with this item',
            condition: createBlockItemCondition(['GALLERY4', 'GALLERY5', 'GALLERY6']),
            components: {
              Field: {
                path: '@/components/AdminDashboard/IconSelect',
              },
            },
          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {
            condition: createBlockItemCondition(['GALLERY4', 'GALLERY5', 'GALLERY6']),
          },
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              ParagraphFeature(),
            ],
          }),
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: createBlockItemCondition(['GALLERY4', 'GALLERY5', 'GALLERY6']),
            },
          },
        }),
      ],
    },
  ],
}
