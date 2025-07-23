import { ArrowRight } from 'lucide-react';

const Stats8 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold md:text-4xl">
            Platform performance insights
          </h2>
          <p>Ensuring stability and scalability for all users</p>
          <a
            href="#"
            className="flex items-center gap-1 font-bold hover:underline"
          >
            Read the full impact report
            <ArrowRight className="h-auto w-4" />
          </a>
        </div>
        <div className="mt-14 grid gap-x-5 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-5">
            <div className="text-6xl font-bold">250%+</div>
            <p>average growth in user engagement</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-6xl font-bold">$2.5m</div>
            <p>annual savings per enterprise partner</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-6xl font-bold">200+</div>
            <p>integrations with top industry platforms</p>
          </div>
          <div className="flex flex-col gap-5">
            <div className="text-6xl font-bold">99.9%</div>
            <p>customer satisfaction over the last year</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats8;
