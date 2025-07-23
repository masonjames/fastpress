import type { Block, Field } from 'payload'

import { TextBlock } from '../TextBlock/config'
import { MediaBlock } from '../MediaBlock/config'
import { backgroundColor } from '@/fields/color'
import { FormBlock } from '../Form/config'

const sizeField: Field =
{
  name: 'size',
  type: 'select',
  defaultValue: 'oneThird',
  options: [
    {
      label: 'One Third',
      value: 'oneThird',
    },
    {
      label: 'Half',
      value: 'half',
    },
    {
      label: 'Two Thirds',
      value: 'twoThirds',
    },
  ],
}

const appendSizeFieldToBlock = (block: Block, sizeField: Field): Block => {
  return {
    ...block,
    fields: [
      sizeField,
      ...block.fields,
    ],
  }
}

export const SplitViewBlock: Block = {
  slug: 'splitView',
  interfaceName: 'SplitViewBlock',
  fields: [
    backgroundColor,
    {
      name: 'columns',
      label: {
        en: 'Columns',
        de: 'Spalten',
      },
      type: 'blocks',
      /**
       * All blocks, that should be supported by the split view
       */
      blocks: [
        appendSizeFieldToBlock(TextBlock, sizeField),
        appendSizeFieldToBlock(MediaBlock, sizeField),
        appendSizeFieldToBlock(FormBlock, sizeField),
      ],
    },
  ],
}
