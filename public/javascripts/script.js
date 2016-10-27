var data = [
		{item: "positive", number: 0},
		{item: "neutral", number: 0},
		{item: "negative", number: 0}
	];

var socket = io();

var search = true;

socket.on('received data', function(msg){
	console.log(msg.valence);
	if(search){
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
		ReDraw();
	}
});

function Stop_search(){
	search = false;
}

function Refresh_Data(){
	data = [
		{item: "positive", number: 0},
		{item: "neutral", number: 0},
		{item: "negative", number: 0}
	];
}

function Search(){
	search = true;
	Refresh_Data();
	$("#graph").empty();

	//Remove the animation
	$('.twitter_animation').empty();
	$('.twitter_animation').remove();

	var search_key = $("#search_key").val();
	socket.emit('search', search_key);
	console.log(search_key);

	// $("#search_key").val("");
	

	//Put JSON data into the graph function
	DrawGraph(data);
}

	var margin = {top: 40, right: 20, bottom: 50, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

	// var formatPercent = d3.format(".0%");
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

	var svg;

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
					return "<strong>Frequency:</strong> <span style='color:red'>" + d.number + "</span>";
				});

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
		.text("Analyse");    

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		// .attr("transform", "rotate(-90)")
		.attr("y", -15)
		.attr("x", 30)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Number");

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
}