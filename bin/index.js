#! /usr/bin/env node

var marked = require('marked'),
    fs = require('fs'),
    chalk = require('chalk'),
    argv = require('yargs')
    .usage('Usage: $0 --input [Markdown File] --lineLength [num]')
    .default({'input': 'README.md', 'lineLength': 80})
    .alias('i', 'input')
    .nargs('input', 1)
    .alias('l', 'lineLength')
    .help('h')
    .alias('h', 'help')
    .demand(['input'])
    .argv,

    renderer = new marked.Renderer();
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: true
    }),
    wrap = require('word-wrap');

var inputFile = fs.readFileSync(argv.input, 'utf-8')

// Block Level Methods

renderer.code = function (code, language) {
  return chalk.bold('<--- code block: ' + language + '--->')
    + '\n'
    + chalk.green(code)
    + '\n\n'
    + chalk.bold('</--- code block --->')
    + '\n\n';
},

renderer.blockquote = function (quote) {
  return chalk.bgBlack(quote);
},

renderer.html = function (html) {
  return html;
},

renderer.heading = function (text, level) {
  if (level == 1) {
    return '\n' + chalk.bold.underline(text) + '\n\n';
  } else {
    return chalk.underline(text) + '\n\n';
  }
},

renderer.hr = function () {
  return;
},

renderer.list = function (body, ordered) {
  return body;
},

renderer.listitem = function (text) {
  return text;
},

renderer.paragraph = function (text) {
  return text + '\n\n';
},

renderer.table = function (header, body) {
  return header + '\n\n' + body + '\n';
},

renderer.tablerow = function (content) {
  return content;
},

renderer.tablecell = function (content, flags) {
  // flags has the following properties:
  //
  // {
  //   header: true || false,
  //   align: 'center' || 'left' || 'right'
  // }
  return content;
},

// Inline Level Methods

renderer.strong = function (text) {
  return chalk.bold(text);
},

renderer.em = function (text) {
  return text;
},

renderer.codespan = function (code) {
  return chalk.inverse(code);
},

renderer.br = function () {
  return '\n';
},

renderer.del = function (text) {
  return text;
},

renderer.link = function (href, title, text) {
  return text;
},

renderer.image = function (href, title, text) {
  return text;
};

var inputFileWrapped = wrap(inputFile, {width: argv.lineLength, indent: ''});

console.log(marked (inputFileWrapped, {renderer: renderer}));