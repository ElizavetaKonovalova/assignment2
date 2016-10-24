var retext = require('retext');
var sentiment = require('retext-sentiment');
var cliche = require('retext-cliches');
var equality = require('retext-equality');
var report = require('vfile-reporter');
var profanity = require('retext-profanities');
var inspect = require('unist-util-inspect');
var json = require('json-query');

//Visualization
var d3 = require('d3');
var jsdom = require('jsdom');

module.exports = function (data) {

    retext().use(sentiment).use(function () {
        return function (cst) {
            //Visualisation(json('data', {data: cst}).value);
            console.log(json('data', {data: cst}).value);
        };
    }).process(data);

    retext().use(cliche).use(profanity).use(equality).process(data, function (err, file) {
        //console.log(String(file));
        if (file !== "no issues found")
            console.error(report(err || file));
    });
};


/*function Visualisation(data) {

 var document = jsdom.jsdom();
 var p = d3.select(document.body).selectAll("p")
 .data(data)
 .enter()
 .append("p")
 .text(function (d,i) {
 return "i = " + i + " d = "+d;
 });
 }*/