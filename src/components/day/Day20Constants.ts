// Day 20 shared types and constants

export interface ExperimentOption {
  readonly type: string
  readonly icon: string
  readonly label: string
  readonly task: string
}

export const EXPERIMENTS: readonly ExperimentOption[] = [
  {
    type: 'social',
    icon: '\u{1F5E3}',
    label: '\u793E\u4EA4',
    task: '\u53D1\u4E00\u6761\u4EC5\u81EA\u5DF1\u53EF\u89C1\u7684\u52A8\u6001',
  },
  {
    type: 'clothing',
    icon: '\u{1F454}',
    label: '\u7A7F\u7740',
    task: '\u7A7F\u4E00\u4EF6\u201C\u5947\u602A\u201D\u7684\u8863\u670D\u51FA\u95E8',
  },
  {
    type: 'behavior',
    icon: '\u{1F3AD}',
    label: '\u884C\u4E3A',
    task: '\u72EC\u81EA\u505A\u4E00\u4EF6\u5C0F\u4E8B\uFF08\u5982\u72EC\u81EA\u770B\u7535\u5F71\uFF09',
  },
] as const

export const COMPLETION_TEXT = '\u5B58\u5728\u611F\u4E0D\u6765\u81EA\u88AB\u770B\u89C1\uFF0C\u800C\u6765\u81EA\u81EA\u6211\u786E\u8BA4'
export const COURAGE_POINTS = 10
