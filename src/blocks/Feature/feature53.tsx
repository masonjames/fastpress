import { Media } from '../../components/Media'
import { FeatureBlock } 

/**
 * A grid of USPs with images and titles
 */
const Feature53: React.FC<FeatureBlock> = ({ USPs }) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {USPs?.map((usp, i) => (
            <div
              key={i}
              className="border-b border-l border-border py-4 even:border-r md:border-b-0 md:even:border-r-0 md:nth-[4n]:border-r"
            >
              <div className="relative flex min-h-[150px] flex-col md:mx-4 lg:min-h-[280px] lg:pl-8">
                <p className="text-center font-mono text-xs md:text-left">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="ml-2">{usp.tagline}</span>
                </p>
                {usp.image && (
                  <Media
                    resource={usp.image}
                    imgClassName="absolute inset-0 m-auto max-h-12 max-w-[60%] object-contain object-center pt-5 md:max-w-[70%]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Feature53;
