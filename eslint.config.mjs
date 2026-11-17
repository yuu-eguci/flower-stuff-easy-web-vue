import pluginVue from 'eslint-plugin-vue'
import { withVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { neostandard } from 'neostandard'

export default withVueTs(
  {
    ignores: ['dist/**']
  },
  // standard スタイルを .ts と .vue にも適用します。
  neostandard({
    ts: true,
    noJsx: true,
    files: ['**/*.vue'],
    env: ['node']
  }),
  pluginVue.configs['flat/vue2-recommended'],
  vueTsConfigs.recommended,
  {
    linterOptions: {
      // NODE_ENV により有効・無効が変わるルールの disable コメントを、未使用として報告しないようにします。
      reportUnusedDisableDirectives: 'off'
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    }
  }
)
