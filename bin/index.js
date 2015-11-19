#! /usr/bin/env node

var marked = require('marked');
var fs = require('fs');
var chalk = require('chalk');
var argv = require('yargs')
  .usage('Usage: $0 --input [Markdown File] --lineLength [num]')
  .default({'input': 'README.md', 'lineLength': 80})
  .alias('i', 'input')
  .nargs('input', 1)
  .alias('l', 'lineLength')
  .help('h')
  .alias('h', 'help')
  .demand(['input'])
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
var wrap = require('word-wrap');

// Block Level Methods

renderer.code = function (code) {
  return chalk.inverse.green(code) + '\n\n';
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
  return chalk.underline(Array(argv.lineLength).join(' ')) + '\n\n\n';
};

renderer.list = function (body) {
  return body;
};

renderer.listitem = function (text) {
  return text;
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
  var inputFile = fs.readFileSync(argv.input, 'utf-8');
  var inputFileWrapped = wrap(inputFile, {width: argv.lineLength, indent: ''});
  console.log(marked (inputFileWrapped, {renderer: renderer}));
} else {
  module.exports = function (input) {
    var inputFile = fs.readFileSync(input, 'utf-8');
    var inputFileWrapped = wrap(inputFile, {width: argv.lineLength, indent: ''});
    return marked (inputFileWrapped, {renderer: renderer});
  };
}
