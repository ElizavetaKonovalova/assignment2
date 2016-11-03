var data = [
	{item: "positive", number: 0},
	{item: "neutral", number: 0},
	{item: "negative", number: 0}
];

function Refresh_Data(){
	data = [
		{item: "positive", number: 0},
		{item: "neutral", number: 0},
		{item: "negative", number: 0}
	];
}

var socket = io();
var search_key = [];
var margin = {top: 40, right: 20, bottom: 50, left: 40},
	width = 570 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

var formatPercent = d3.format("s");

var x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
	.range([height, 2]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickFormat(formatPercent);

var color = d3.scale.category10();

var svg;

socket.on('received data', function(msg){

	if(msg != null) {
		switch(msg.valence){
			case "positive":
				data[0].number++;
				break;
			case "neutral":
				data[1].number++;
				break;
			case "negative":
				data[2].number++;
				break;
			default:
				break;
		}
		ReDraw();
	}
});

socket.on('keywords', function (result) {

	var randomColor = Math.floor(Math.random()*16777215).toString(16);
	var randomFont = (Math.floor(Math.random() * (60 - 19 + 1)) + 5).toString();

	var text = document.createTextNode(result),
		el = document.createElement('li'),
		messages = document.getElementById('key_words');

	el.style.cssText = "display: inline; list-style-type: inherit; padding-right: 20px; max-width: 100%; width:90%; color: " + randomColor
		+ "; font-size: "+randomFont+"px;";

	el.appendChild(text);
	messages.appendChild(el);
});

socket.on('cliche', function (result) {

	var text = document.createTextNode(result),
		el = document.createElement('li'),
		messages = document.getElementById('cliche');

	el.style.cssText = "max-width: 100%; width:90%; color: white;";

	el.appendChild(text);
	messages.appendChild(el);
});

function Stop() {
	socket.emit('stopit');
}

function Search(){

	 search_key = $("#search_key").val();

	$('#key_words').empty();
	$('#cliche').empty();

	if(search_key){

		// search = true;

		Refresh_Data();

		//Remove the animation
		$('.twitter_animation').empty();
		$('.twitter_animation').remove();
		$("#graph").empty();

		socket.emit('search', search_key);

		//Put JSON data into the graph function
		DrawGraph(data);
	}
}

function ReDraw(){

	x.domain(data.map(function(d) { return d.item; }));
	y.domain([0, d3.max(data, function(d) { return d.number; })]);

	svg.select(".x.axis")
		.transition()
		.duration(300)
		.call(xAxis);

	svg.select(".y.axis")
		.transition()
		.duration(300)
		.call(yAxis);

	var bars = svg.selectAll(".bar").data(data, function(d) { return d.item; });

	bars.exit()
		.transition()
		.duration(300)
		.attr("y", y(0))
		.attr("height", height - y(0))
		.style('fill-opacity', 1e-6)
		.remove();

	bars.enter().append("rect")
		.attr("class", "bar")
		.attr("y", y(0))
		.attr("height", height - y(0));

	bars.transition()
		.duration(300)
		.attr("x", function(d) { return x(d.item); }) // (d) is one item from the data array, x is the scale object from above
		.attr("width", x.rangeBand()) // constant, so no callback function(d) here
		.attr("y", function(d) { return y(d.number); })
		.attr("height", function(d) { return height - y(d.number); });
}

function DrawGraph(data){

	svg = d3.select("#graph").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return "<strong>" + d.item + ": </strong> <span style='color:red'>" + d.number + "</span>";
		});

	svg.call(tip);

	// The following code was contained in the callback function.
	x.domain(data.map(function(d) { return d.item; }));
	y.domain([0, d3.max(data, function(d) { return d.number; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.style("fill", "white")
		.call(xAxis);

	svg.append("text")      // text label for the x axis
		.attr("x", (width/2) )
		.attr("y",  height + 40 )
		.style("text-anchor", "middle")
		.style("fill", "white")
		.text("Sentiment Analysis on tweets related to " + search_key);

	svg.append("g")
		.attr("class", "y axis")
		.style("fill", "white")
		.call(yAxis)
		.append("text")
		.attr("y", -20)
		.attr("x", 50)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Total tweets");

	svg.selectAll(".bar")
		.data(data)
		.enter().append("rect")
		.style("fill", function(d, i) { return color(i); })
		.attr("class", "bar")
		.attr("x", function(d) { return x(d.item); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(d.number); })
		.attr("height", function(d) { return height - y(d.number); })
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);
}