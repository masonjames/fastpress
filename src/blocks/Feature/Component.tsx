import Feature1 from '../../blocks/Feature/feature1'
import Feature2 from '../../blocks/Feature/feature2'
import Feature3 from '../../blocks/Feature/feature3'
import Feature4 from '../../blocks/Feature/feature4'
import Feature5 from '../../blocks/Feature/feature5'
import Feature6 from '../../blocks/Feature/feature6'
import Feature7 from '../../blocks/Feature/feature7'
import Feature8 from '../../blocks/Feature/feature8'
import Feature9 from '../../blocks/Feature/feature9'
import Feature10 from '../../blocks/Feature/feature10'
import Feature11 from '../../blocks/Feature/feature11'
import Feature12 from '../../blocks/Feature/feature12'
import Feature13 from '../../blocks/Feature/feature13'
import Feature14 from '../../blocks/Feature/feature14'
import Feature15 from '../../blocks/Feature/feature15'
import Feature16 from '../../blocks/Feature/feature16'
import Feature17 from '../../blocks/Feature/feature17'
import Feature18 from '../../blocks/Feature/feature18'
import Feature19 from '../../blocks/Feature/feature19'
import Feature20 from '../../blocks/Feature/feature20'
import Feature21 from '../../blocks/Feature/feature21'
import Feature22 from '../../blocks/Feature/feature22'
import Feature23 from '../../blocks/Feature/feature23'
import Feature24 from '../../blocks/Feature/feature24'
import Feature25 from '../../blocks/Feature/feature25'
import Feature26 from '../../blocks/Feature/feature26'
import Feature27 from '../../blocks/Feature/feature27'
import Feature28 from '../../blocks/Feature/feature28'
import Feature29 from '../../blocks/Feature/feature29'
import Feature30 from '../../blocks/Feature/feature30'
import Feature31 from '../../blocks/Feature/feature31'
import Feature32 from '../../blocks/Feature/feature32'
import Feature33 from '../../blocks/Feature/feature33'
import Feature34 from '../../blocks/Feature/feature34'
import Feature35 from '../../blocks/Feature/feature35'
import Feature36 from '../../blocks/Feature/feature36'
import Feature37 from '../../blocks/Feature/feature37'
import Feature38 from '../../blocks/Feature/feature38'
import Feature39 from '../../blocks/Feature/feature39'
import Feature41 from '../../blocks/Feature/feature41'
import Feature42 from '../../blocks/Feature/feature42'
import Feature43 from '../../blocks/Feature/feature43'
import Feature44 from '../../blocks/Feature/feature44'
import Feature50 from '../../blocks/Feature/feature50'
import Feature51 from '../../blocks/Feature/feature51'
import Feature52 from '../../blocks/Feature/feature52'
import Feature53 from '../../blocks/Feature/feature53'
import Feature54 from '../../blocks/Feature/feature54'
import Feature55 from '../../blocks/Feature/feature55'
import Feature56 from '../../blocks/Feature/feature56'
import Feature57 from '../../blocks/Feature/feature57'
import Feature58 from '../../blocks/Feature/feature58'
import Feature59 from '../../blocks/Feature/feature59'
import Feature60 from '../../blocks/Feature/feature60'
import Feature61 from '../../blocks/Feature/feature61'
import Feature62 from '../../blocks/Feature/feature62'
import Feature63 from '../../blocks/Feature/feature63'
import Feature64 from '../../blocks/Feature/feature64'
import Feature65 from '../../blocks/Feature/feature65'
import Feature66 from '../../blocks/Feature/feature66'
import Feature67 from '../../blocks/Feature/feature67'
import Feature68 from '../../blocks/Feature/feature68'
import Feature69 from '../../blocks/Feature/feature69'
import Feature70 from '../../blocks/Feature/feature70'
import Feature71 from '../../blocks/Feature/feature71'
import Feature72 from '../../blocks/Feature/feature72'
import Feature73 from '../../blocks/Feature/feature73'
import Feature74 from '../../blocks/Feature/feature74'
import Feature75 from '../../blocks/Feature/feature75'
import Feature76 from '../../blocks/Feature/feature76'
import Feature77 from '../../blocks/Feature/feature77'
import Feature78 from '../../blocks/Feature/feature78'
import Feature79 from '../../blocks/Feature/feature79'
import Feature80 from '../../blocks/Feature/feature80'
import Feature81 from '../../blocks/Feature/feature81'
import Feature82 from '../../blocks/Feature/feature82'
import Feature83 from '../../blocks/Feature/feature83'
import Feature85 from '../../blocks/Feature/feature85'
import Feature86 from '../../blocks/Feature/feature86'
import Feature87 from '../../blocks/Feature/feature87'
import Feature89 from '../../blocks/Feature/feature89'
import Feature90 from '../../blocks/Feature/feature90'
import Feature91 from '../../blocks/Feature/feature91'
import Feature92 from '../../blocks/Feature/feature92'
import Feature93 from '../../blocks/Feature/feature93'
import Feature94 from '../../blocks/Feature/feature94'
import Feature95 from '../../blocks/Feature/feature95'
import Feature97 from '../../blocks/Feature/feature97'
import Feature98 from '../../blocks/Feature/feature98'
import Feature99 from '../../blocks/Feature/feature99'
import Feature101 from '../../blocks/Feature/feature101'
import Feature102 from '../../blocks/Feature/feature102'
import Feature103 from '../../blocks/Feature/feature103'
import Feature104 from '../../blocks/Feature/feature104'
import Feature105 from '../../blocks/Feature/feature105'
import Feature106 from '../../blocks/Feature/feature106'
import Feature107 from '../../blocks/Feature/feature107'
import Feature108 from '../../blocks/Feature/feature108'
import Feature109 from '../../blocks/Feature/feature109'
import Feature114 from '../../blocks/Feature/feature114'
import Feature117 from '../../blocks/Feature/feature117'
import Feature126 from '../../blocks/Feature/feature126'

import { Page } 
import { FeatureDesignVersion, allFeatureDesignVersions } from './config'

// Extract just the value property from FeatureDesignVersion for use as keys
type FeatureDesignVersionValue = FeatureDesignVersion['value']

// Enforce required features but allow additional ones
type Feature<T extends string = string> = Required<Record<FeatureDesignVersionValue, React.FC<any>>> & Record<T, React.FC<any>>;

const features: Feature = {
  FEATURE1: Feature1,
  FEATURE2: Feature2,
  FEATURE3: Feature3,
  FEATURE4: Feature4,
  FEATURE5: Feature5,
  FEATURE6: Feature6,
  FEATURE7: Feature7,
  FEATURE8: Feature8,
  FEATURE9: Feature9,
  FEATURE10: Feature10,
  FEATURE11: Feature11,
  FEATURE12: Feature12,
  FEATURE13: Feature13,
  FEATURE14: Feature14,
  FEATURE15: Feature15,
  FEATURE16: Feature16,
  FEATURE17: Feature17,
  FEATURE18: Feature18,
  FEATURE19: Feature19,
  FEATURE20: Feature20,
  FEATURE21: Feature21,
  FEATURE22: Feature22,
  FEATURE23: Feature23,
  FEATURE24: Feature24,
  FEATURE25: Feature25,
  FEATURE26: Feature26,
  FEATURE27: Feature27,
  FEATURE28: Feature28,
  FEATURE29: Feature29,
  FEATURE30: Feature30,
  FEATURE31: Feature31,
  FEATURE32: Feature32,
  FEATURE33: Feature33,
  FEATURE34: Feature34,
  FEATURE35: Feature35,
  FEATURE36: Feature36,
  FEATURE37: Feature37,
  FEATURE38: Feature38,
  FEATURE39: Feature39,
  FEATURE41: Feature41,
  FEATURE42: Feature42,
  FEATURE43: Feature43,
  FEATURE44: Feature44,
  FEATURE50: Feature50,
  FEATURE51: Feature51,
  FEATURE52: Feature52,
  FEATURE53: Feature53,
  FEATURE54: Feature54,
  FEATURE55: Feature55,
  FEATURE56: Feature56,
  FEATURE57: Feature57,
  FEATURE58: Feature58,
  FEATURE59: Feature59,
  FEATURE60: Feature60,
  FEATURE61: Feature61,
  FEATURE62: Feature62,
  FEATURE63: Feature63,
  FEATURE64: Feature64,
  FEATURE65: Feature65,
  FEATURE66: Feature66,
  FEATURE67: Feature67,
  FEATURE68: Feature68,
  FEATURE69: Feature69,
  FEATURE70: Feature70,
  FEATURE71: Feature71,
  FEATURE72: Feature72,
  FEATURE73: Feature73,
  FEATURE74: Feature74,
  FEATURE75: Feature75,
  FEATURE76: Feature76,
  FEATURE77: Feature77,
  FEATURE78: Feature78,
  FEATURE79: Feature79,
  FEATURE80: Feature80,
  FEATURE81: Feature81,
  FEATURE82: Feature82,
  FEATURE83: Feature83,
  FEATURE85: Feature85,
  FEATURE86: Feature86,
  FEATURE87: Feature87,
  FEATURE89: Feature89,
  FEATURE90: Feature90,
  FEATURE91: Feature91,
  FEATURE92: Feature92,
  FEATURE93: Feature93,
  FEATURE94: Feature94,
  FEATURE95: Feature95,
  FEATURE97: Feature97,
  FEATURE98: Feature98,
  FEATURE99: Feature99,
  FEATURE101: Feature101,
  FEATURE102: Feature102,
  FEATURE103: Feature103,
  FEATURE104: Feature104,
  FEATURE105: Feature105,
  FEATURE106: Feature106,
  FEATURE107: Feature107,
  FEATURE108: Feature108,
  FEATURE109: Feature109,
  FEATURE114: Feature114,
  FEATURE117: Feature117,
  FEATURE126: Feature126,
}

export const FeatureBlock: React.FC<Page['layout'][0]> = (props) => {
  if (props.blockType !== 'feature') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const FeatureToRender = features[designVersion]

  if (!FeatureToRender) return null

  return <FeatureToRender {...props} />
}
