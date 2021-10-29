import { Context } from 'koishi'

export interface ImageGeneratorOptions {
  reserve: boolean
  maxLength: number
  offsetX: number
  upper: {
    font: string
    weight: string | number
  },
  lower: {
    font: string
    weight: string | number
  }
}

export interface ConfigObject {
  /**
   * 设置上行文字。
   */
  upper: {
    /**
     * 设置上行文字的字体文件路径。
     */
    path?: string
    /**
     * 设置上行文字的字体名。
     */
    name?: string
    /**
     * 设置上行文字的字重。
     */
    weight?: string | number
  },
  /**
   * 设置下行文字。
   */
  lower: {
    /**
     * 设置下行文字的字体文件路径。
     */
    path?: string
    /**
     * 设置下行文字的字体名。
     */
    name?: string
    /**
     * 设置下行文字的字重。
     */
    weight?: string | number
  }
  /**
   * 是否强制清除消息段中的非文字元素。
   *
   * 当设置为 `true` 时，指令选项 `--reserve` 将失效。
   *
   * @default false
   */
  disableCQCode?: boolean
  /**
   * 一行最多字符数
   *
   * @default 42
   */
  maxLength?: number
  /**
   * 第二行文字的默认向右偏移距离（单位为px）
   *
   * @default 200
   */
  defaultOffsetX?: number
  /**
   * 第二行文字的最大向右偏移距离（单位为px）
   *
   * @default 1000
   */
  maxOffsetX?: number
}

export declare const apply: (ctx: Context, config: ConfigObject) => void