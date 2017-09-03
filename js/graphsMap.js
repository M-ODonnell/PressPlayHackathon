$(document).ready(function() {
	// bar graph data
	var data = {
		labels: [],
		datasets: [
			{
				fillColor: "rgba(51,201,51,0.7)",
	            strokeColor: "rgba(151,187,205,0.8)",
	            highlightFill: "rgba(51,201,51,0.95)",
	            highlightStroke: "rgba(151,187,205,1)",
	            data: []
			}
		]
	};

	// set up map
	var map = L.map("map").setView([42.293623, -83.023610], 12); // 42.308696, -83.033438
	
	L.tileLayer('http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
	}).addTo(map);

	var prevRouteData = [];
	// load json for bar graph and map
	$.getJSON("stopPOI.json", function(data2) {
		$.each(data2, function(key, value) {
			// populate bar graph data
			var tLabel = key + ", " + value[1];
			var dist = Math.floor(value[0]);
			data.labels.push(tLabel);
			data.datasets[0].data.push(dist);

			// add markers to map
			L.marker([value[3], value[2]])
			.addTo(map)
			.bindPopup(key + ": " + dist +" metres from " + value[1])
			.on("click", function() {
				if (prevRouteData.length > 0) {
					prevRouteData.forEach(function(busRouteLine, index) {
						map.removeLayer(busRouteLine);
					});
				}
				// load the route data that corresponds to the marker
				$.getJSON("routes_ll84.geojson", function(rData) {
					$.each(rData.features, function(dx, routeData) {
						if (routeData.properties.NAME == value[1]) {
							var busRouteLine = L.geoJson(routeData);
							busRouteLine.addTo(map);
							prevRouteData.push(busRouteLine)
						}
					});
				});
			});
		});


		var ctx = $("#barGraph").get(0).getContext("2d");
		var options = {tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>m"};
		var myBarChart = new Chart(ctx).Bar(data, options);
	});

	// tourism data pie chart
	var tourismData = [
	    {
	        value: 3326007,
	        color:"#B56CFF",
	        highlight: "#D3A7FF",
	        label: "same day"
	    },
	    {
	        value: 1519962,
	        color: "#4DB8DB",
	        highlight: "#94D4E9",
	        label: "overnight"
	    }
	];
	var ctx2 = $("#tourismStats").get(0).getContext("2d");
	new Chart(ctx2).Pie(tourismData);
});

/*
points removed from POI
{
	"Dominion Golf and Country Club": [
		42.207263, 
		-82.999070
	]
}
{
	"Pottery and Palettes Art Studio": [
		42.312227, 
		-82.868084
	]
}
 */