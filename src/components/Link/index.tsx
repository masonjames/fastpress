import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'
import { Icon } from '@/components/Icon'
import localization from '@/localization.config'
import { PublicContextProps } from '@/utilities/publicContextProps'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  section?: string | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  iconBefore?: string | null
  iconAfter?: string | null
  iconClassName?: string
  /**
   * If true, we use the next/link (default behavior).
   * If false, we use a span element instead. This is useful, if you have the CMSLink inside
   * another <a> element
   */
  withAnchor?: boolean
  publicContext: PublicContextProps
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    section,
    size: sizeFromProps,
    url,
    iconBefore,
    iconAfter,
    iconClassName,
    withAnchor = true,
    publicContext,
  } = props

  const locale = publicContext?.locale || localization.defaultLocale;
  let href = url;
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    // Prefix url with locale if it's not the default locale
    const localePrefix = locale !== localization.defaultLocale ? `/${locale}` : '';
    // Prefix url with collection name if it's not the pages collection
    const relationToPrefix = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : '';
    // Add remaining url path
    const remainingPath = ((reference?.relationTo === 'pages' && (reference?.value as Page)?.breadcrumbs) ? (reference?.value as Page)?.breadcrumbs?.[((reference?.value as Page)?.breadcrumbs?.length! - 1)]?.url : `/${reference.value.slug}`) || `/${reference.value.slug}`;
    const normalizedRemainingPath = reference.value.slug === 'home' ? '' : remainingPath;
    href = `${localePrefix}${relationToPrefix}${normalizedRemainingPath}`;
  }

  if (type === 'reference' && section) {
    href += `#${section}`
  }


  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  const content = (
    <>
      {iconBefore && <Icon className={cn('mr-2 h-6', iconClassName)} icon={iconBefore} />}
      {label && label}
      {children && children}
      {iconAfter && <Icon className={cn('ml-2 h-6', iconClassName)} icon={iconAfter} />}
    </>
  )

  /* Ensure we don't break any styles set by richText */
  if (appearance === 'inline') {
    if (!withAnchor) {
      return <span className={cn('inline-flex items-center', className)}>{content}</span>
    }
    return (
      <Link
        className={cn('inline-flex items-center', className)}
        href={href || url || ''}
        {...newTabProps}
      >
        {content}
      </Link>
    )
  }

  if (!withAnchor) {
    return (
      <Button
        className={className}
        size={(size as typeof sizeFromProps) || 'default'}
        variant={appearance}
      >
        <span className="flex items-center">{content}</span>
      </Button>
    )
  }

  return (
    <Button
      asChild
      className={className}
      size={(size as typeof sizeFromProps) || 'default'}
      variant={appearance}
    >
      <Link
        className={cn('flex items-center', className)}
        href={href || url || ''}
        {...newTabProps}
      >
        {content}
      </Link>
    </Button>
  )
}
