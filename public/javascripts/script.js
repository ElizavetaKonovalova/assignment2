var data = [
		{item: "positive", number: 0},
		{item: "neutral", number: 0},
		{item: "negative", number: 0}
	];

var socket = io();

socket.on('received data', function(msg){
	console.log(msg.valence);
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
	}
});

function Search(){
	//Remove the animation
	$('.twitter_animation').empty();
	$('.twitter_animation').remove();

	socket.emit('search', $("#search_key").val());

	$("#graph").empty();

	DrawGraph(data);
}


function DrawGraph(data){
	var margin = {top: 40, right: 20, bottom: 50, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	for(var i=0; i < data.length; i++) {
		data[i].xScale = d3.scale().domain([data[i].item, data[i].number]);
	}

	var graph = d3.select('#graph').selectAll('g.graph').data(data, data.forEach(function (element) {
		return element.item;
	}));

	var newGraph = graph.enter()
		.append("g")
		.attr('class', 'graph');

	/*// var formatPercent = d3.format(".0%");
	var formatPercent = d3.format("s");

	var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
			.range([height, 0]);

	var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

	var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(formatPercent);

	var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(function(d) {
					return "<strong>Frequency:</strong> <span style='color:red'>" + d.number + "</span>";
				});

	var svg = d3.select("#graph").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	// The following code was contained in the callback function.
	x.domain(data.map(function(d) { return d.item; }));
	y.domain([0, d3.max(data, function(d) { return d.number; })]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("text")      // text label for the x axis
		.attr("x", (width/2) )
		.attr("y",  height + 40 )
		.style("text-anchor", "middle")
		.text("Date");    

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		// .attr("transform", "rotate(-90)")
		.attr("y", -15)
		.attr("x", 30)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");

	svg.selectAll(".bar")
			.data(data)
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d.item); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.number); })
			.attr("height", function(d) { return height - y(d.number); })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide);

	svg.selectAll('#graph').data([data]).attr('d',tip);
	svg.exit()*/
}