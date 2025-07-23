import { Media } from "@/components/Media";
import RichText from "@/components/RichText";
import { FeatureBlock } from "@/payload-types";
import { PublicContextProps } from '../../utilities/publicContextProps';

const Feature102: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ USPs, richText, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-screen-md flex-col justify-center gap-7 md:text-center">
          {richText && (
            <RichText publicContext={publicContext}
              withWrapper={false}
              content={richText}
              overrideStyle={{
                h1: 'text-2xl md:text-4xl',
                h2: 'text-2xl md:text-4xl',
                h3: 'text-xl md:text-2xl',
                h4: 'text-xl md:text-2xl',
                p: 'text-sm text-muted-foreground md:text-base',
              }}
            />
          )}
        </div>
        <div className="mx-auto mt-14 flex max-w-screen-lg flex-col gap-4 lg:px-16">
          {USPs && USPs?.map((usp, i) => {
            return (
              <div key={usp.id} className="flex flex-col items-center justify-between min-[960px]:flex-row min-[960px]:gap-10">
                <div className="flex gap-4 min-[960px]:max-w-md">

                  {i === 0 && (
                    <div className="flex flex-col items-center justify-between gap-1">
                      <span className="h-20 shrink-0"></span>
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-lg">
                        {i + 1}
                      </span>
                      <span className="h-20 w-[3px] shrink-0 bg-linear-to-b from-transparent to-primary opacity-70"></span>
                    </div>)}

                  {i > 0 && (
                    i !== USPs.length - 1 ? (
                      <div className="relative flex flex-col items-center justify-between gap-1">
                        <span className="absolute -top-8 mx-auto h-8 w-[3px] shrink-0 bg-primary opacity-70"></span>
                        <span className="absolute -bottom-8 mx-auto h-8 w-[3px] shrink-0 bg-primary opacity-70"></span>
                        <span className="h-20 w-[3px] shrink-0 bg-primary opacity-70"></span>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-lg">
                          {i + 1}
                        </span>
                        <span className="h-20 w-[3px] shrink-0 bg-primary opacity-70"></span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-between gap-1">
                        <span className="h-20 w-[3px] shrink-0 bg-linear-to-t from-transparent to-primary opacity-70"></span>
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-lg">
                          {i + 1}
                        </span>
                        <span className="h-20 shrink-0"></span>
                      </div>
                    )
                  )}

                  <div className="flex flex-col justify-center gap-5 px-0 min-[960px]:gap-6 min-[960px]:p-4">
                    {usp.richText && (
                      <RichText publicContext={publicContext}
                        withWrapper={false}
                        content={usp.richText}
                        overrideStyle={{
                          h2: 'text-2xl min-[960px]:text-3xl',
                          h3: 'text-xl min-[960px]:text-2xl',
                          h4: 'text-xl min-[960px]:text-2xl',
                          p: 'text-sm text-muted-foreground min-[960px]:text-base',
                        }}
                      />
                    )}
                  </div>
                </div>
                {usp.image ? <Media resource={usp.image} imgClassName="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" className="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" /> : (
                  <div className="text-red-500">USP image is required</div>
                )}
              </div>
            )
          })}
          {/*
          <div className="flex flex-col items-center justify-between min-[960px]:flex-row min-[960px]:gap-10">
            <div className="flex gap-4 min-[960px]:max-w-md">
              <div className="relative flex flex-col items-center justify-between gap-1">
                <span className="absolute -top-8 mx-auto h-8 w-[3px] shrink-0 bg-primary opacity-70"></span>
                <span className="absolute -bottom-8 mx-auto h-8 w-[3px] shrink-0 bg-primary opacity-70"></span>
                <span className="h-20 w-[3px] shrink-0 bg-primary opacity-70"></span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-lg">
                  2
                </span>
                <span className="h-20 w-[3px] shrink-0 bg-primary opacity-70"></span>
              </div>
              <div className="flex flex-col justify-center gap-5 px-0 min-[960px]:gap-6 min-[960px]:p-4">
                <h3 className="text-xl min-[960px]:text-2xl">
                  Immediate Issue Detection
                </h3>

                <p className="text-sm text-muted-foreground min-[960px]:text-base">
                  Spot issues instantly and address them with precise metrics
                  for optimized performance.
                </p>
              </div>
            </div>

            {USPs?.[0].image && <Media resource={USPs?.[0].image} imgClassName="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" className="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" />}
          </div>
          <div className="flex flex-col items-center justify-between min-[960px]:flex-row min-[960px]:gap-10">
            <div className="flex gap-4 min-[960px]:max-w-md">
              <div className="flex flex-col items-center justify-between gap-1">
                <span className="h-20 w-[3px] shrink-0 bg-linear-to-t from-transparent to-primary opacity-70"></span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted/50 font-mono text-lg">
                  3
                </span>
                <span className="h-20 shrink-0"></span>
              </div>
              <div className="flex flex-col justify-center gap-5 px-0 min-[960px]:gap-6 min-[960px]:p-4">
                <h3 className="text-xl min-[960px]:text-2xl">
                  Revert to a Stable Version
                </h3>

                <p className="text-sm text-muted-foreground min-[960px]:text-base">
                  With just a few actions, revert to a previous version and
                  restore system health swiftly.
                </p>
              </div>
            </div>
            {USPs?.[0].image && <Media resource={USPs?.[0].image} imgClassName="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" className="z-10 aspect-video w-full rounded-xl border object-contain min-[960px]:max-h-56 min-[960px]:w-auto" />}
          </div>
          */}

        </div>
      </div>
    </section>
  );
};

export default Feature102;
