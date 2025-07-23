import encryptionHooks from '@/hooks/encryptionHook'
import { lexicalEditor, OrderedListFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const ChangelogBlock: Block = {
  slug: 'changelog',
  labels: {
    singular: 'Changelog',
    plural: 'Changelogs',
  },
  fields: [
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: [{ label: 'Changelog 1', value: 'CHANGELOG1' }],
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        description: {
          en: 'Add a tagline underneath the intro text',
          de: 'Überschrift unterhalb des Intro-Texts hinzu',
        },
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures]
        },
      }),
    },
    {
      name: 'fetchFromGithub',
      label: {
        en: 'Automatically fetch changelog updates from GitHub (this feature is not yet implemented)',
        de: 'Automatisch Changelog-Aktualisierung von GitHub abrufen (diese Funktion ist noch nicht implementiert)',
      },
      type: 'checkbox',
    },
    {
      name: 'githubSettings',
      admin: {
        condition: (_, { fetchFromGithub }) => fetchFromGithub,
      },
      type: 'group',
      fields: [
        {
          name: 'repository',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'company/repo',
            description: 'The repository to fetch the changelog from',
          },
        },
        {
          name: 'githubToken',
          type: 'text',
          admin: {
            description: 'Optional GitHub token to use for authentication',
          },
          hooks: encryptionHooks,
        },
        {
          name: 'Fetch now',
          type: 'ui',
          admin: {
            components: {
              Field: {
                path: '@/components/AdminDashboard/Changelog/FetchButton',
              }
            }
          }
        }
      ],
    },
    {
      name: 'entries',
      label: {
        en: 'Changelog entries',
        de: 'Changelog-Einträge',
      },
      admin: {
        description: {
          en: 'Add changelog entries. Entries coming from Github won\'t be overwritten when the data is updated manually.',
          de: 'Changelog-Einträge hinzufügen',
        }
      },
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: {
              en: "Describe this release. We will auto-generate it using the version, if not set"
            }
          }
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                OrderedListFeature(),
                UnorderedListFeature()
              ]
            },
          }),
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        {
          name: 'version',
          type: 'text',
          required: true,
        },
        {
          // If this is a github entry, we store the id here to keep track of it.
          name: 'githubId',
          type: 'text',
          admin: {
            hidden: true,
          },
        },
        {
          // We can optionally add an image for each entry
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: {
              en: 'Optional image for the entry',
              de: 'Optionales Bild für den Eintrag',
            }
          }
        }
      ]
    }
  ],
  interfaceName: 'changelogblock',
}

export default ChangelogBlock
