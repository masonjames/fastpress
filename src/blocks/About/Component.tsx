
import { AboutDesignVersion } from './config'
import About1 from '@/blocks/About/about1'
import About2 from '@/blocks/About/about2'
import About3 from '@/blocks/About/about3'
import About4 from '@/blocks/About/about4'
import About5 from '@/blocks/About/about5'

// Enforce required features but allow additional ones
type About<T extends string = string> = Required<Record<AboutDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const about: About = {
  ABOUT1: About1,
  ABOUT2: About2,
  ABOUT3: About3,
  ABOUT4: About4,
  ABOUT5: About5,
}

export const AboutBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'about') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const AboutToRender = about[designVersion as AboutDesignVersion]

  if (!AboutToRender) return null

  return <AboutToRender {...props} />
}

export default AboutBlock