import { Card } from '@/components/ui/card';

const integrations = [
  {
    title: 'Slack',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-1.svg',
  },
  {
    title: 'Google Drive',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-2.svg',
  },
  {
    title: 'Dropbox',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-3.svg',
  },
  {
    title: 'Github',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-4.svg',
  },
  {
    title: 'Figma',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-5.svg',
  },
  {
    title: 'Trello',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-6.svg',
  },
  {
    title: 'Asana',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-1.svg',
  },
  {
    title: 'Jira',
    description:
      'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam, corporis!',
    image: '/images/block/block-2.svg',
  },
];

const Feature44 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <h2 className="mb-4 text-2xl font-semibold lg:text-4xl">
          Integrations
        </h2>
        <p className="text-muted-foreground lg:text-lg">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate qui
          dignissimos odit.
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration, i) => (
            <li key={i}>
              <Card className="p-6">
                <img
                  src={integration.image}
                  alt={integration.title}
                  className="w-14"
                />
                <h3 className="mb-1 mt-4 text-lg font-medium">
                  {integration.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Feature44;
