var markdownChalk = require('../bin/index.js');
var test = require('tape');
var fs = require('fs');

var readFile = function(path) {
  return fs.readFileSync(path, 'utf8');
};

test ('code parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/code.md')), '\x1b[7m\x1b[32mcode\x1b[39m\x1b[27m\n', 'code should be inverted and green');
  t.end();
});

test ('blockquote parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/blockquote.md')), '\x1b[40mblockquotes\n\n\x1b[49m', 'blockquotes should have a black background');
  t.end();
});

test ('html parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/html.md')), '&lt;h1&gt;HTML parsing test&lt;/h1&gt;\n\n\n', 'html should be encoded correctly');
  t.end();
});

test ('heading parsing tests', function (t) {
  t.equal(markdownChalk(readFile('./test/heading1.md')), '\n\x1b[1m\x1b[4mHeading 1\x1b[24m\x1b[22m\n\n', 'top level headings should be bold, underlined, and with a newline ahead of it');
  t.equal(markdownChalk(readFile('./test/heading234.md')), '\x1b[4mHeading 2\x1b[24m\n\n\x1b[4mHeading 3\x1b[24m\n\n\x1b[4mHeading 4\x1b[24m\n\n', 'second level headings should be underlined');
  t.end();
});

test ('horizontal rule parsing tests', function (t) {
  t.equal(
    markdownChalk(readFile('./test/hr.md')),
    '\x1b[4m                                                                               \x1b[24m\n',
    'horizontal rules look blank, but are actually underlined sections');
  t.end();
});

test ('list and listitem parsing tests', function (t) {
  t.equal(markdownChalk(readFile('./test/unorderedlist.md')), '- Item 1\n- Item 2\n- Item 3\n\n', 'unordered lists should return the body of the list, with newlines, list items should be unmodified');
  t.equal(markdownChalk(readFile('./test/orderedlist.md')), '- Item 1\n- Item 2\n- Item 3\n\n', 'ordered lists should return the body of the list, with newlines, list items should be unmodified');
  t.end();
});

test ('paragraph parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/paragraphs.md')), 'Testing paragraph parsing.\n\nTesting paragraph parsing a second time.\n\n', 'paragraphs should have two new lines appended');
  t.end();
});

test ('table parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/table.md')), '\n', 'tables should not be output with markdown-chalk');
  t.end();
});

test ('strong parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/strong.md')), '\x1b[1mstrong\x1b[22m\n\n', 'strong text should be emboldened');
  t.end();
});

test ('emotive parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/em.md')), 'emotive\n\n', 'emotive text should be returned raw');
  t.end();
});

test ('codespan parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/codespan.md')), '\x1b[7mcodespan\x1b[27m next to regular text\n\n', 'codespans should be inverted');
  t.end();
});

test ('break parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/break.md')), 'end a line with two or more spaces  \n\n', 'breaks should be returned as newlines');
  t.end();
});

test ('del parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/del.md')), '&lt;del&gt;Deleted Text&lt;/del&gt;\n\n', 'deleted tags should be returned as HTML');
  t.end();
});

test ('link parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/link.md')), 'http://www.example.com\n\n', 'links should return only the text');
  t.end();
});

test ('image parsing test', function (t) {
  t.equal(markdownChalk(readFile('./test/image.md')), '\n\n', 'images should not be returned');
  t.end();
});
