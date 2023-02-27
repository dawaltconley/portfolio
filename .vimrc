let g:astro_typescript = 'enable'

let g:ale_linters_explicit = 1
let g:ale_linter_aliases = { 'astro': ['html', 'css', 'scss', 'javascript', 'typescript'] }
let g:ale_linters['astro'] = ['eslint']
