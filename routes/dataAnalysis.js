var retext = require('retext');
var sentiment = require('retext-sentiment');
var cliche = require('retext-cliches');
var equality = require('retext-equality');
var profanity = require('retext-profanities');
var json = require('json-query');

//Visualization
var d3 = require('d3');
var jsdom = require('jsdom');

module.exports = function (data) {

	var result;

    retext().use(sentiment).use(function () {
        return function (cst) {
        	// console.log("-----------------------------");
            result = json('data', {data: cst}).value;
        };
    }).process(data);

    // retext().use(cliche).use(profanity).use(equality).process(data, function (err, file) {
    //     if ((json('messages.message', {data: file}).value).length != 0)
    //         console.error(json('messages.message', {data: file}).value);
    // });

    return result;
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

};

