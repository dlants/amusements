---
title: Coding assistant prompts
draft: true
shortUrl: coding-assistant-prompts
---

avante.nvim ([link](https://github.com/yetone/avante.nvim/blob/main/lua/avante/templates/planning.avanterules)) SEARCH/REPLACE blocks. For context, just includes a treesitter-summarized content of all of the files that match the given files’ extension https://github.com/yetone/avante.nvim/blob/main/lua/avante/repo_map.lua#L55



aider ([link](https://github.com/Aider-AI/aider/blob/main/aider/coders/editblock_prompts.py)) SEARCH/REPLACE blocks, seems really similar. Avante probably actually copied this from aider. For context, parses all files using treesitter to build a multi-directed-graph. The weights on the edges are set based on the current context (which files are open, which files are mentioned in the user’s query). Then a pagerank algo is run on the graph to sort the symbols by their relevance. The resulting list is then converted into chunks of code (lines of interest), and as much of it as can fit is shoved into the context window.



Zed - no automated context gathering.



Aide-AI - Sidecar is the LLM-integrated piece, and is a port of Aider to Rust, integrated w/ a VSCode fork. Also uses pagerank. (link)




