
var system = require('system');
var url = system.args[1];
var test = system.args[2];
var filename = system.args[3];

var page = new WebPage();

var WebPage = require('webpage');
page = WebPage.create();
page.open(url);
console.log(url);
console.log(filename);
page.onLoadFinished = function() {
   page.render('/tmp/' + 'targetFilename' + '.png');
   phantom.exit();}