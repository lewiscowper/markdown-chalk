#! /usr/bin/env node

var marked = require('marked'),
    fs = require('fs'),
    chalk = require('chalk'),
    argv = require('yargs')
    .usage('Usage: $0 --input [Markdown File] --lineLength [num]')
    .default({'input': 'README.md', 'lineLength': 70})
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
});

// From here http://jsfiddle.net/jahroy/Rwr7q/18/
// Folds a string at a specified length, optionally attempting
// to insert newlines after whitespace characters.
//
// Returns an array of strings that are no longer than lineLength
// characters long.  If resultArray is specified as an array, the lines 
// found in inputString will be pushed onto the end of resultArray. 
//
// If inputString is huge and n is very small, this method will have
// problems... StackOverflow.
//

function fold(inputString, lineLength, useSpaces, resultArray) {
  resultArray = resultArray || [];
  if (inputString.length <= lineLength) {
    resultArray.push(inputString);
    return resultArray;
  }
  var line = inputString.substring(0, lineLength);
  if (! useSpaces) { // insert newlines anywhere
    resultArray.push(line);
    return fold(inputString.substring(lineLength), lineLength, useSpaces, resultArray);
  }
  else { // attempt to insert newlines after whitespace
    var lastSpaceRgx = /\s(?!.*\s)/;
    var idx = line.search(lastSpaceRgx);
    var nextIdx = lineLength;
    if (idx > 0) {
      line = line.substring(0, idx);
      nextIdx = idx;
    }
    resultArray.push(line);
    return fold(inputString.substring(nextIdx), lineLength, useSpaces, resultArray);
  }
}

var inputFile = fs.readFileSync(argv.input, 'utf-8')

var inputFileArray = fold(inputFile, argv.lineLength, true);
var inputFileWithNewLines = inputFileArray.join('\n');

// Block Level Methods

renderer.code = function (code, language) {
  return chalk.green(code) + '\n\n';
},

renderer.blockquote = function (quote) {
  return chalk.bgBlack(quote) + '\n';
},

renderer.html = function (html) {
  return html + '\n';
},

renderer.heading = function (text, level) {
  if (level == 1) {
    return '\n' + chalk.bold.underline(text) + '\n\n';
  } else {
    return chalk.underline(text) + '\n\n';
  }
},

renderer.hr = function () {
  return '\n\n';
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
  return '';
},

renderer.del = function (text) {
  return text;
},

renderer.link = function (href, title, text) {
  return text;
},

renderer.image = function (href, title, text) {
  return text;
},

console.log(marked (inputFileWithNewLines, {renderer: renderer}));