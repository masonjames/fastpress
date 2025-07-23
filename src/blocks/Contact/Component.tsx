import { ContactDesignVersion } from './config'
import Contact1 from '@/blocks/Contact/contact1'
import Contact3 from '@/blocks/Contact/contact3'
import Contact2 from '@/blocks/Contact/contact2'
import Contact4 from '@/blocks/Contact/contact4'

// Enforce required contacts but allow additional ones
type Contact<T extends string = string> = Required<Record<ContactDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const contact: Contact = {
  CONTACT1: Contact1,
  CONTACT3: Contact3,
  CONTACT2: Contact2,
  CONTACT4: Contact4,
}

export const ContactBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'contact') return null
  if (!designVersion) return null

  const ContactToRender = contact[designVersion as ContactDesignVersion]

  if (!ContactToRender) return null

  return <ContactToRender {...props} />
}

export default ContactBlock