set relativenumber

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
let g:ale_linter_aliases['sass'] = ['scss']
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

function! s:try_coc_action(action, fallback)
  let l:try = CocAction(a:action)
  if (!l:try)
    call feedkeys(a:fallback, 'in')
  endif
endfunction

nnoremap <silent> gd :call <SID>try_coc_action('jumpDefinition', 'gd')<CR>
nnoremap <silent> gD :call <SID>try_coc_action('jumpDeclaration', 'gD')<CR>
