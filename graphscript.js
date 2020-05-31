var margin = { top: 10, right: 10, bottom: 10, left: 10 };
    var width = 900 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geoMercator()
        .center([0, 0])
        .scale(3500)
        .translate([10000, 1500])

    let proj = d3.geoPath().projection(projection)

    var colorScaleOR = d3.scaleThreshold()
        .domain([0,25,100,250,500,1000,2000])
        .range(d3.schemeOrRd[9])
    
    var colorScaleGB = d3.scaleThreshold()
        .domain([0,1,2,3, 4, 5, 6])
        .range(d3.schemeGnBu[9])
    
    
    //Tooltip 
    var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0); 

    
    window.onload = popGraph() // So the user starts with a graph 
    
    function popGraph(){
        console.log("Squirtle ");
        
          d3.json("HawaiiData.json").then(function(data) {
              
              d3.selectAll("svg > *").remove(); // Used to clear SVG
              // Got code from https://stackoverflow.com/questions/22452112/nvd3-clear-svg-before-loading-new-chart
        
            //drawing map and coloring 
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.counties).features)
                .enter()
                .append("path")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                //.attr("fill", "green")
                .attr("fill", function(d) {return colorScaleOR(Number(d.properties.density))})
                //.attr("fill", function(d) {return d3.schemeOrRd[9][d.properties.density]})
                .attr("d", proj)
                .on("mouseover", function(d){   //When we mouse over a county
                    div.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                
                    div.html(   
                    "County              : " + d.properties.name + " county" + "<br>" +
                    "Density  : " + d.properties.density + "per sqaure mile" + "<br>"
                    ) 
                    .style("left", (d3.event.pageX- 50) + "px")	//Changing x and y values so we dont obscure mouse pointer view 	
                    .style("top", (d3.event.pageY - 20) + "px");//These are used so tooltip appears near county we are observing 
               
                    })
                .on("mouseout" , function(d){   // When we stop pointing at a county we want tooltip to go away 
                    div.transition()
                        .duration(500)
                        .style("opacity", 0); 
                    }) 
                .each(function(d){ 
                    console.log(colorScaleOR(d.properties.density))
                })
                .each(function(d){ 
                    console.log(Number(d.properties.density));
                })

            //Adding legend 
            var g = svg.append("g")
                .attr("class" , "key")
                .attr("transform", "translate(0,40)")

            //Got legend from California visluazation by Mike Bostock https://bl.ocks.org/mbostock/670b9fe0577a29c39a1803f59c628769



            // Got assistance from student Ryan Sun on how to draw legend correctly 
            var range = colorScaleOR.range().map(function(d) {
                d = colorScaleOR.invertExtent(d); 
                return d; 
            })
            range.splice(0,1) // removing undefined values 
            range.splice(range.length - 2, 2)

            var x = d3.scaleSqrt()
                .domain([0, 4500])
                .rangeRound([440, 950]);

            console.log(x)

            g.selectAll("rect")
                    .data(range)
                    .enter().append("rect")
                    .attr("height", 8)
                    .attr("x", function (d) { return x(d[0]); })               
                    .attr("width", function (d) { return x(d[1]) - x(d[0]); })
                    .attr("fill", function (d) { return colorScaleOR(d[0]); });     
            g.append("text")
                    .data(range)
                    .attr("x" , 500)
                    .attr("y", -5)
                    .attr("fill" , "black")
                    .text("Population per square mile")
            g.call(d3.axisBottom(x)
                    .tickSize(13)
                    .tickValues(colorScaleOR.domain()))
                    .select(".domain")
                    .remove(); 

        })
    }
    
    function visGraph() {
        console.log("Charmander ");
        
        d3.selectAll("svg > *").remove();
        
        d3.json("HawaiiData.json").then(function(data) {
        
             console.log(data)

            //drawing map and coloring 
            svg.append("g")
                .selectAll("path")
                .data(topojson.feature(data, data.objects.counties).features)
                .enter()
                .append("path")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .attr("fill", function(d) {return colorScaleGB(Number(d.properties.visitors))})
                .attr("d", proj)
                .on("mouseover", function(d){   //When we mouse over a county
                    div.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                
                    div.html(   
                    "County              : " + d.properties.name + " county" + "<br>" +
                    "Visitors  : " + d.properties.visitors + " Million People" + "<br>"
                    ) 
                    .style("left", (d3.event.pageX- 50) + "px")	//Changing x and y values so we dont obscure mouse pointer view 	
                    .style("top", (d3.event.pageY - 20) + "px");//These are used so tooltip appears near county we are observing 
               
                    })
                .on("mouseout" , function(d){   // When we stop pointing at a county we want tooltip to go away 
                    div.transition()
                        .duration(500)
                        .style("opacity", 0); 
                    }) 
                /*.each(function(d){ 
                    console.log(colorScaleGB(d.properties.visitors))
                })*/
                .each(function(d){ 
                    console.log(Number(d.properties.visitors));
                })

            //Adding legend 
            var g = svg.append("g")
                .attr("class" , "key")
                .attr("transform", "translate(0,40)")

            //Got legend from California visluazation by Mike Bostock https://bl.ocks.org/mbostock/670b9fe0577a29c39a1803f59c628769



            var range = colorScaleGB.range().map(function(d) {
                d = colorScaleGB.invertExtent(d); 
                return d; 
            })
            range.splice(0,1) // removing undefined values 
            range.splice(range.length - 2, 2)

            var x = d3.scaleSqrt()
                .domain([0, 14])
                .rangeRound([440, 950]);

            //console.log(x)

            g.selectAll("rect")
                    .data(range)
                    .enter().append("rect")
                    .attr("height", 8)
                    .attr("x", function (d) { return x(d[0]); })               
                    .attr("width", function (d) { return x(d[1]) - x(d[0]); })
                    .attr("fill", function (d) { return colorScaleGB(d[0]); });     
            g.append("text")
                    .data(range)
                    .attr("x" , 500)
                    .attr("y", -5)
                    .attr("fill" , "black")
                    .text("Visitors per year (Millions)")
            g.call(d3.axisBottom(x)
                    .tickSize(13)
                    .tickValues(colorScaleGB.domain()))
                    .select(".domain")
                    .remove(); 

        })
    }