
import { TestimonialDesignVersion } from './config'
import Testimonial2 from '@/blocks/Testimonial/testimonial2'
import Testimonial3 from '@/blocks/Testimonial/testimonial3'
import Testimonial4 from '@/blocks/Testimonial/testimonial4'
import Testimonial6 from '@/blocks/Testimonial/testimonial6'
import Testimonial7 from '@/blocks/Testimonial/testimonial7'
import Testimonial13 from '@/blocks/Testimonial/testimonial13'
import Testimonial10 from '@/blocks/Testimonial/testimonial10'
import Testimonial16 from '@/blocks/Testimonial/testimonial16'
import Testimonial17 from '@/blocks/Testimonial/testimonial17'
import Testimonial18 from '@/blocks/Testimonial/testimonial18'
import Testimonial19 from '@/blocks/Testimonial/testimonial19'
import Testimonial1 from '@/blocks/Testimonial/testimonial1'
import Testimonial11 from '@/blocks/Testimonial/testimonial11'
import Testimonial12 from '@/blocks/Testimonial/testimonial12'
import Testimonial14 from '@/blocks/Testimonial/testimonial14'
import Testimonial8 from '@/blocks/Testimonial/testimonial8'
import Testimonial9 from '@/blocks/Testimonial/testimonial9'
import Testimonial15 from '@/blocks/Testimonial/testimonial15'

type Testimonial<T extends string = string> = Required<Record<TestimonialDesignVersion, React.FC<any>>> & Record<T, React.FC<any>>;

const testimonial: Testimonial = {
  TESTIMONIAL1: Testimonial1,
  TESTIMONIAL2: Testimonial2,
  TESTIMONIAL3: Testimonial3,
  TESTIMONIAL4: Testimonial4,
  TESTIMONIAL6: Testimonial6,
  TESTIMONIAL8: Testimonial8,
  TESTIMONIAL9: Testimonial9,
  TESTIMONIAL11: Testimonial11,
  TESTIMONIAL12: Testimonial12,
  TESTIMONIAL14: Testimonial14,
  TESTIMONIAL15: Testimonial15,
  TESTIMONIAL7: Testimonial7,
  TESTIMONIAL13: Testimonial13,
  TESTIMONIAL10: Testimonial10,
  TESTIMONIAL16: Testimonial16,
  TESTIMONIAL17: Testimonial17,
  TESTIMONIAL18: Testimonial18,
  TESTIMONIAL19: Testimonial19,
}

export const TestimonialBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'testimonial') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const TestimonialToRender = testimonial[designVersion as TestimonialDesignVersion]

  if (!TestimonialToRender) return null

  return <TestimonialToRender {...props} />
}

export default TestimonialBlock