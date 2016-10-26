var socket = io();

console.log(socket.io.engine.id + "");


socket.on('socketToMe', function(msg){
	console.log(msg);
});


function Search(){

	//Remove the animation
	$('.twitter_animation').empty();
	$('.twitter_animation').remove();

	var search_key = $("#search_key").val();
	console.log(search_key);

	//API to call to the server
	// $.ajax({
	// 	url : "",
	// 	port: 3000,
	// 	async: true,
	// 	type: "GET",
	// 	dataType: 'json',
	// 	success: function(data){

	// 	}
	// });

	$("#graph").empty();

	//JSON data returned from API
	var data = [
		// {letter: "A", frequency: .08167},
		// {letter: "B", frequency: .01492},
		// {letter: "C", frequency: .02780},
		// {letter: "D", frequency: .04253},
		// {letter: "E", frequency: .12702},
		// {letter: "F", frequency: .02288},
		// {letter: "G", frequency: .02022},
		// {letter: "H", frequency: .06094},
		// {letter: "I", frequency: .06973},
		// {letter: "J", frequency: .00153},
		// {letter: "K", frequency: .00747},
		// {letter: "L", frequency: .04025},
		// {letter: "M", frequency: .02517},
		// {letter: "N", frequency: .06749},
		// {letter: "O", frequency: .07507},
		// {letter: "P", frequency: .01929},
		// {letter: "Q", frequency: .00098},
		// {letter: "R", frequency: .05987},
		// {letter: "S", frequency: .06333},
		// {letter: "T", frequency: .09056},
		// {letter: "U", frequency: .02758},
		// {letter: "V", frequency: .01037},
		// {letter: "W", frequency: .02465},
		{letter: "X", frequency: .00150},
		{letter: "Y", frequency: .01971},
		{letter: "Z", frequency: .00074}
	];

	//Put JSON data into the graph function
	DrawGraph(data);
}


function DrawGraph(data){
	var margin = {top: 40, right: 20, bottom: 50, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var formatPercent = d3.format(".0%");

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
					return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
				});

	var svg = d3.select("#graph").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	

	// The following code was contained in the callback function.
	x.domain(data.map(function(d) { return d.letter; }));
	y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

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
			.attr("x", function(d) { return x(d.letter); })
			.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.frequency); })
			.attr("height", function(d) { return height - y(d.frequency); })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
}