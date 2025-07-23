const Stat5 = () => {
  return (
    <section className="py-32">
      <div className="container flex flex-col items-start text-left">
        <h2 className="mb-10 w-full max-w-[24rem] text-pretty text-2xl font-bold sm:text-4xl md:mb-16 md:max-w-120 lg:max-w-148 lg:text-5xl lg:leading-16">
          Here are some stats to look at
        </h2>
        <div className="flex w-full flex-col gap-x-4 gap-y-12 border-border md:flex-row md:border-b md:pb-6">
          <div className="w-full">
            <div className="mb-3 text-6xl md:mb-4">95%</div>
            <div className="leading-6 text-muted-foreground md:text-lg">
              Metric 1
            </div>
          </div>
          <div className="w-full">
            <div className="mb-3 text-6xl md:mb-4">95%</div>
            <div className="leading-6 text-muted-foreground md:text-lg">
              Metric 2
            </div>
          </div>
          <div className="w-full">
            <div className="mb-3 text-6xl md:mb-4">95%</div>
            <div className="leading-6 text-muted-foreground md:text-lg">
              Metric 3
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stat5;
