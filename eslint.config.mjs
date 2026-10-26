// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/html-self-closing': [
      'error',
      { html: { void: 'always', normal: 'always', component: 'always' } },
    ],
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-vars': 'error',
    // Le Markdown du contenu passe par <MDC> (rendu en éléments Vue, sans innerHTML)
    'vue/no-v-html': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
})
