import RichText from "@/components/RichText";
import { StatBlock } from "@/payload-types";
import { PublicContextProps } from '@/utilities/publicContextProps';

const Stat1: React.FC<StatBlock & { publicContext: PublicContextProps }> = ({ headline, stats, publicContext }) => {
  return (
    <section className="py-32">
      <div className="container">
        {headline && <RichText publicContext={publicContext}
          content={headline}
          withWrapper={false}
          overrideStyle={{
            h1: 'text-center text-4xl font-semibold lg:text-6xl',
            h2: 'text-center text-3xl font-semibold lg:text-5xl',
            h3: 'text-center text-2xl font-semibold lg:text-4xl',
            h4: 'text-center text-1xl font-semibold lg:text-3xl',
          }}
        />}
        <div className="grid gap-10 pt-9 md:grid-cols-3 lg:gap-0 lg:pt-20">
          {stats?.map(({ title, counter, description, id }) => (
            <div className="text-center" key={id}>
              {description && (<RichText publicContext={publicContext}
                content={description}
                withWrapper={false}
                overrideStyle={{
                  p: "text-sm font-medium text-muted-foreground",
                }}
              />)}
              <p className="pt-4 text-7xl font-semibold lg:pt-10">
                {counter}
              </p>
              {title && (<p className="text-2xl font-semibold text-muted-foreground">
                {title}
              </p>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stat1;
