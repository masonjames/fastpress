import Cta1 from '@/blocks/Cta/cta1'
import Cta3 from '@/blocks/Cta/cta3'
import Cta4 from '@/blocks/Cta/cta4'
import Cta5 from '@/blocks/Cta/cta5'
import Cta6 from '@/blocks/Cta/cta6'
import Cta7 from '@/blocks/Cta/cta7'
import Cta10 from '@/blocks/Cta/cta10'
import Cta11 from '@/blocks/Cta/cta11'
import Cta12 from '@/blocks/Cta/cta12'
import Cta13 from '@/blocks/Cta/cta13'
import Cta15 from '@/blocks/Cta/cta15'
import Cta16 from '@/blocks/Cta/cta16'
import Cta17 from '@/blocks/Cta/cta17'

import { CtaDesignVersion } from './config'

type Cta<T extends string = string> = Required<Record<CtaDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const ctas: Cta = {
  CTA1: Cta1,
  CTA3: Cta3,
  CTA4: Cta4,
  CTA5: Cta5,
  CTA6: Cta6,
  CTA7: Cta7,
  CTA10: Cta10,
  CTA11: Cta11,
  CTA12: Cta12,
  CTA13: Cta13,
  CTA15: Cta15,
  CTA16: Cta16,
  CTA17: Cta17,
}

export const CtaBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'cta') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const CtaToRender = ctas[designVersion as CtaDesignVersion]

  if (!CtaToRender) return null

  return <CtaToRender {...props} />
}

export default CtaBlock