import Logos2 from '@/blocks/Logos/logos2'
import Logos3 from '@/blocks/Logos/logos3'

import { LogosDesignVersion } from './config'

type Logos<T extends string = string> = Required<Record<LogosDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const Logos: Logos = {
  LOGOS2: Logos2,
  LOGOS3: Logos3,
}

export const LogosBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'logos') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const LogosToRender = Logos[designVersion as LogosDesignVersion]

  if (!LogosToRender) return null

  return <LogosToRender {...props} />
}

export default LogosBlock