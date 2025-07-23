import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { icon } from '@/components/Icon/config'
import { backgroundColor } from '@/fields/color'
import { linkGroup } from '@/fields/linkGroup'
import { Block } from 'payload'

export const allBannerDesignVersions = [
  { label: 'BANNER5', value: 'BANNER5', image: '/admin/previews/banner/banner5.webp' },
] as const

export type BannerDesignVersion = (typeof allBannerDesignVersions)[number]

export const allBannerPositions = ['TOP', 'BOTTOM'] as const

export type BannerPosition = (typeof allBannerPositions)[number]

export const BannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlockV2',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allBannerDesignVersions),
    {
      name: 'position',
      type: 'select',
      defaultValue: 'TOP',
      options: allBannerPositions.map((position) => ({ label: position, value: position })),
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['BANNER5'].includes(designVersion),
      },
    },
    {
      name: 'defaultVisible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show by default',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
    },
    icon({
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['BANNER5'].includes(designVersion),
      },
    }),
    linkGroup({
      appearances: false,
      overrides: {
        admin: {
          condition: (_, { designVersion = '' } = {}) => ['BANNER5'].includes(designVersion),
        },
      },
    }),
  ],
}
