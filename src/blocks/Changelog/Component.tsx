import React from 'react'
import type { Page } from '@/payload-types'
import { Changelog1 } from './changelog1'
import { PublicContextProps } from '@/utilities/publicContextProps'

const changelogs = {
  CHANGELOG1: Changelog1,
}

export const ChangelogBlock: React.FC<Page['layout'][0] & { publicContext: PublicContextProps }> = (props) => {
  if (props.blockType !== 'changelog') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const ChangelogToRender = changelogs[designVersion]

  if (!ChangelogToRender) return null

  return <ChangelogToRender {...props} />
}

