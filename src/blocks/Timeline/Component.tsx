import { TimelineDesignVersion } from './config'
import Timeline2 from './timeline2'
import Timeline8 from './timeline8'

type Timeline<T extends string = string> = Required<Record<TimelineDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const timeline: Timeline = {
  TIMELINE2: Timeline2,
  TIMELINE8: Timeline8,
}

export const TimelineBlock: React.FC<any> = (props) => {
  const { designVersion } = props || {}
  if (props.blockType !== 'timeline') return null
  if (!designVersion) return null

  const TimelineToRender = timeline[designVersion as TimelineDesignVersion]

  if (!TimelineToRender) return null

  return <TimelineToRender {...props} />
}

export default TimelineBlock
