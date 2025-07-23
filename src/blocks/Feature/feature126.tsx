'use client'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion'
import { Badge } from '../../components/ui/badge'
import type { FeatureBlock, Media as MediaType } 
import { PublicContextProps } from '../../utilities/publicContextProps'
import { splitRichText } from '../../utilities/richtext'
import { useState } from 'react'

const Feature126: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  badge,
  richText,
  publicContext,
  links,
  USPs,
}) => {
  const tabsData = USPs?.filter((usp) => usp.id).map((usp) => {
    const { firstNode, rest } = splitRichText(usp.richText, {
      splitOn: ['h2', 'h3', 'h4', 'h5', 'h6'],
      takeFirst: true,
    })
    return {
      id: usp.id as string,
      headline: firstNode,
      richtext: rest,
      image: usp.image as MediaType,
    }
  })

  const [activeTabId, setActiveTabId] = useState<string | null>(tabsData?.[0]?.id || null)
  const [activeImage, setActiveImage] = useState<MediaType | null>(tabsData?.[0]?.image || null)

  if (!tabsData?.length || !activeTabId || !activeImage)
    return <div className="text-red-500">You need to add USPs for the component to work, all USPs need to have an image set as well</div>

  return (
    <section className="py-32">
      <div className="container">
        {badge && <Badge>{badge}</Badge>}
        {richText && (
          <RichText
            publicContext={publicContext}
            content={richText}
            overrideStyle={{
              h2: 'mb-5 mt-4 text-3xl font-extrabold',
              p: 'text-muted-foreground lg:text-lg',
            }}
          />
        )}
        <div className="mb-16 mt-3 flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-8">
          {/* <a
                        href='#'
                        className='group flex items-center gap-2 text-muted-foreground hover:cursor-pointer'
                    >
                        All blocks examples
                        <span className='transform transition-transform duration-300 group-hover:translate-x-2'>
                            <MoveRight className='size-4' />
                        </span>
                    </a>
                    <a
                        href='#'
                        className='group flex items-center gap-2 text-muted-foreground hover:cursor-pointer'
                    >
                        All features examples
                        <span className='transform transition-transform duration-300 group-hover:translate-x-2'>
                            <MoveRight className='size-4' />
                        </span>
                    </a> */}
        </div>

        <div className="mb-12 flex w-full items-center justify-between gap-28">
          <div className="w-full md:max-w-[400px]">
            <Accordion type="single" className="w-full" defaultValue={tabsData[0].id}>
              {tabsData.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={tab.id}
                  className={`border-b-0 border-t-2 px-2 transition hover:bg-accent ${tab.id === activeTabId && 'border-foreground'}`}
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image)
                      setActiveTabId(tab.id)
                    }}
                    className={`cursor-pointer py-5 no-underline! transition`}
                  >
                    {tab.headline && (
                      <RichText
                        publicContext={publicContext}
                        content={tab.headline}
                        withWrapper={false}
                        overrideStyle={{
                          h3: `text-xl font-semibold text-muted-foreground ${tab.id === activeTabId ? 'text-black' : 'text-muted-foreground'}`,
                        }}
                      />
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    {tab.richtext && (
                      <RichText
                        publicContext={publicContext}
                        content={tab.richtext}
                        overrideStyle={{
                          p: 'mt-3 text-muted-foreground',
                        }}
                      />
                    )}
                    {tab.image && (
                      <Media
                        className="mt-4 md:hidden"
                        resource={tab.image}
                        imgClassName="h-full max-h-80 w-full rounded-md object-cover"
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative m-auto hidden w-[calc(100%-100px)] max-w-[1266px] overflow-hidden md:block">
            <div className="absolute bottom-0 left-0 right-0 z-2 h-[100px] bg-[linear-gradient(to_top,white_0%,rgba(255,255,255,0)_100%)]"></div>
            <Media
              resource={activeImage}
              imgClassName="max-h-[490px] w-full rounded-md object-cover transition-opacity duration-300"
            />
          </div>
        </div>

        {links &&
          links.map((link, index) => (
            <CMSLink
              publicContext={publicContext}
              iconClassName="size-4 ml-2"
              key={index}
              {...link.link}
            />
          ))}
      </div>
    </section>
  )
}

export default Feature126
