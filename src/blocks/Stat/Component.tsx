import { StatDesignVersion } from './config'
import Stat1 from '@/blocks/Stat/stat1'
import Stat2 from '@/blocks/Stat/stat2'
import Stat4 from '@/blocks/Stat/stat4'
import Stat5 from '@/blocks/Stat/stat5'
import Stat6 from '@/blocks/Stat/stat6'
import Stat7 from '@/blocks/Stat/stat7'
import Stat8 from '@/blocks/Stat/stat8'

type Stat<T extends string = string> = Required<Record<StatDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const stat: Stat = {
  STAT1: Stat1,
  STAT2: Stat2,
  STAT4: Stat4,
  STAT5: Stat5,
  STAT6: Stat6,
  STAT7: Stat7,
  STAT8: Stat8,
}

export const StatBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'stat') return null
  if (!designVersion) return null

  const StatToRender = stat[designVersion as StatDesignVersion]

  if (!StatToRender) return null

  return <StatToRender {...props} />
}

export default StatBlock