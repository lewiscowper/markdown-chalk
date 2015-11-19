# Markdown-Chalk

A markdown parser that uses chalk to print a markdown file nicely in the terminal.

# CLI usage

```
Usage: markdown-chalk --input [Markdown File] --lineLength [num]

Options:
  -h, --help        Show help                                          [boolean]
  -i, --input                                  [required] [default: "README.md"]
  -l, --lineLength                                                 [default: 70]
```

# Require() usage

```javascript

var markdownChalk = require('markdown-chalk');

var result = markdownChalk('path/to/file.md');

console.log(result);

```
