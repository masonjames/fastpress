import { BannerDesignVersion, allBannerDesignVersions } from './config'
import Banner5 from './banner5'

// Extract the value property from BannerDesignVersion for use as keys
type BannerVersionValue = BannerDesignVersion['value'];

type Banner<T extends string = string> = Required<Record<BannerVersionValue, React.FC<any>>> & Record<T, React.FC<any>>;

const banner: Banner = {
  BANNER5: Banner5,
}

export const BannerBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'banner') return null
  if (!designVersion) return null

  const BannerToRender = banner[designVersion as BannerVersionValue]

  if (!BannerToRender) return null

  return <BannerToRender {...props} />
}

export default BannerBlock
