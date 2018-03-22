#! /usr/bin/env node

var marked = require('marked');
var fs = require('fs');
var chalk = require('chalk');
var readline = require('readline');
var argv = require('yargs')
  .usage('Usage: $0 --input [Markdown File] --lineLength [num]')
  .default({'lineLength': 80})
  .alias('i', 'input')
  .nargs('input', 1)
  .alias('l', 'lineLength')
  .help('h')
  .alias('h', 'help')
  .argv;

var renderer = new marked.Renderer();
marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: true
});

// Block Level Methods

renderer.code = function (code) {
  return chalk.inverse.green(code) + '\n';
};

renderer.blockquote = function (quote) {
  return chalk.bgBlack(quote);
};

renderer.html = function (html) {
  return html;
};

renderer.heading = function (text, level) {
  if (level == 1) {
    return '\n' + chalk.bold.underline(text) + '\n\n';
  } else {
    return chalk.underline(text) + '\n\n';
  }
};

renderer.hr = function () {
  return chalk.underline(Array(argv.lineLength).join(' ')) + '\n';
};

renderer.list = function (body) {
  return body + '\n';
};

renderer.listitem = function (text) {
  return '- ' + text + '\n';
};

renderer.paragraph = function (text) {
  return text + '\n\n';
};

renderer.table = function () {
  return '\n';
};

renderer.tablerow = function () {
  return '';
};

renderer.tablecell = function () {
  // flags has the following properties:
  //
  // {
  //   header: true || false,
  //   align: 'center' || 'left' || 'right'
  // }
  return '';
};

// Inline Level Methods

renderer.strong = function (text) {
  return chalk.bold(text);
};

renderer.em = function (text) {
  return text;
};

renderer.codespan = function (code) {
  return chalk.inverse(code);
};

renderer.br = function () {
  return '\n';
};

renderer.del = function (text) {
  return chalk.strikethrough(text);
};

renderer.link = function (text) {
  return text;
};

renderer.image = function () {
  return '';
};

var isExecuting = (require.main === module);

if (isExecuting) {
  var rl = readline.createInterface({
    input: argv.input ? fs.createReadStream(argv.input) : process.stdin,
    output: process.stdout,
    terminal: false
  });

  var markdown = [];

  rl.on('line', function (line) {
    markdown.push(line);
  });

  rl.on('close', function () {
    console.log(marked(markdown.join('\n'), { renderer: renderer }));
  });
} else {
  module.exports = function (input) {
    return marked (input, {renderer: renderer});
  };
}
