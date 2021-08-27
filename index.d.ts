import { Context } from 'koishi'

export interface ConfigObject {
  /**
   * Whether to force clean CQCodes (non-text segment in segments).
   *
   * When set to `true`, it would override the `--reserve` command option.
   *
   * @default false
   */
  disableCQCode?: boolean
  /**
   * Maximum length for one line of text.
   *
   * @default 42
   */
  maxLength?: number
  /**
   * Default offset in x-axis for the second line, in `px`.
   *
   * The minimum value is `0`.
   *
   * @default 200
   */
  defaultOffsetX?: number
  /**
   * Maximum offset in x-axis for the second line, in `px`.
   *
   * The maimum value is `1000`.
   *
   * @default 1000
   */
  maxOffsetX
}

export const apply: (ctx: Context, config: ConfigObject) => void