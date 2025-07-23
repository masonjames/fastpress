import RichText from "@/components/RichText";
import { FeatureBlock } from "@/payload-types";
import { PublicContextProps } from '@/utilities/publicContextProps';

const Feature99: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({ richText, image, links, icon, tagline, USPs, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-20">
          <div className="flex h-fit items-center gap-2.5 whitespace-nowrap text-lg">
            <span className="size-3 shrink-0 rounded-full bg-green-500"></span>
            {tagline}
          </div>
          <div>
            {richText && <RichText publicContext={publicContext} content={richText} withWrapper={false} overrideStyle={{ h2: "mb-11 text-3xl lg:text-5xl" }} />}
            <div className="grid gap-8 md:grid-cols-3">
              {USPs?.map(({ richText }, index) => (
                <div className="flex flex-col gap-1 border-l px-4 md:pl-8" key={index}>
                  <span className="font-mono text-4xl lg:text-7xl">{index + 1}</span>
                  {richText && <RichText publicContext={publicContext} content={richText} withWrapper={false} overrideStyle={{ h3: "text-xl font-medium", p: "text-sm text-muted-foreground", li: "text-sm text-muted-foreground" }} />}
                </div>
              ))}


            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature99;
