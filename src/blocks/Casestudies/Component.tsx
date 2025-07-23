import { CasestudiesDesignVersion } from './config'
import { Casestudies5 } from './casestudies5'

// Extract the value property from CasestudiesDesignVersion for use as keys
type CasestudiesVersionValue = CasestudiesDesignVersion['value'];

type Casestudies<T extends string = string> = Required<Record<CasestudiesVersionValue, React.FC<any>>> & Record<T, React.FC<any>>;

const casestudies: Casestudies = {
  CASESTUDIES5: Casestudies5,
}

export const CasestudiesBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'casestudies') return null
  if (!designVersion) return null

  const CasestudiesToRender = casestudies[designVersion as CasestudiesVersionValue]

  if (!CasestudiesToRender) return null

  return <CasestudiesToRender {...props} />
}

export default CasestudiesBlock
