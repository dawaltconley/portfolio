let g:astro_typescript = 'enable'

let g:ale_linters_explicit = 1
let g:ale_linters = {
\ 'astro': ['eslint', 'stylelint'],
\ 'typescript': ['eslint', 'tsserver'],
\ 'javascript': ['eslint', 'tsserver'],
\ 'css': ['stylelint'],
\ 'scss': ['stylelint']
\}
let g:ale_linter_aliases['astro'] = ['html', 'css', 'scss', 'javascript', 'typescript']
let g:ale_fixers['astro'] = ['prettier']
let g:ale_fix_on_save = 1
let g:ale_completion_enabled = 1

source ~/.vim/coc.vim

" Use K to show documentation in preview window.
nnoremap <silent> K :call <SID>show_documentation()<CR>

function! s:show_documentation()
  if CocAction('hasProvider', 'hover')
    call CocActionAsync('doHover')
  else
    call feedkeys('K', 'in')
  endif
endfunction
