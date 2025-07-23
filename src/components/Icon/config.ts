import { RecursivePartial } from '@/utilities/typeUtils';
import { TextField } from 'payload';

type IconType = (overrides?: RecursivePartial<TextField>) => TextField;

/**
 * Custom icon field type, that allows to select an icon from react-icons library
 * To be used in the payload config
 * @param overrides 
 * @returns 
 */
export const icon: IconType = (overrides) => ({
  // @ts-ignore - We want these properties to be overwritten by the spread
  name: "icon",
  ...overrides as TextField,
  type: 'text',
  admin: {
    width: '50%',
    ...overrides?.admin,
    // Positioned below spread so that select component can not be overridden
    components: {
      ...overrides?.admin?.components,
      Field: {
        path: '@/components/AdminDashboard/IconSelect',
      }
    },
  },
})