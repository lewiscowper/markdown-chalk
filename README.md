# Markdown-Chalk

A markdown parser that uses chalk to print a markdown file nicely in the terminal.

# CLI usage

```
Usage: markdown-chalk --input [Markdown File] --lineLength [num]

Options:
  -h, --help        Show help                                          [boolean]
  -i, --input                                  [required] [default: "README.md"]
  -l, --lineLength                                                 [default: 80]
```

# Require() usage

```javascript

var markdownChalk = require('markdown-chalk');

var result = markdownChalk('# Some Markdown string');

console.log(result);

```
