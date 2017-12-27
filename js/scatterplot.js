
        xMark=[];

        function ScatterPlotChart(element,filename0,filename1) {
            var xScale;
            var yScale;
            var minx=0,maxx=0,miny=0,maxy=0;
            var rawdata= new Array();
            var  chart={};
            var width = 900, height = 900,
            margins = {top: 30, left: 30, right: 30, bottom: 30},
            _x, _y,
            _data = [],
            colors = d3.scale.category10(),
            _svg,
            bodyG;
            var dist = new Array();
            var a = d3.rgb(255,185,15);
            var b = d3.rgb(152,245,255);
            var color = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]

            var compute = d3.interpolate(b,a);
            var min_dis=100;
            var max_dis=0;
            var quantize = d3.scale.quantize();
            function readData(_svg,filename0,filename1) {

                d3.csv(filename0,function (error,csvdata) {
                    if(error){
                        console.log(error);

                    }

                    //console.log(csvdata);
                    csvdata.forEach(
                        function(d) {
                            if(minx>parseFloat(d.x)) minx=parseFloat(d.x);
                            if(maxx<parseFloat(d.x)) maxx=parseFloat(d.x);
                            if(miny>parseFloat(d.y)) miny=parseFloat(d.y);
                            if(maxy<parseFloat(d.y)) maxy=parseFloat(d.y);
                            //rawdata.splice(0,rawdata.length);
                            rawdata.push({w:d.words,x:parseFloat(d.x),y:parseFloat(d.y)});

                        });
                    console.log(minx) ;
                    console.log(maxx) ;
                    console.log(miny) ;
                    console.log(maxy) ;
                    xScale= d3.scale.linear()
                        .domain([minx*1.1,maxx*1.1])
                        .range([0, quadrantWidth()]);
                    yScale= d3.scale.linear()
                        .domain([miny*1.1,maxy*1.1])
                        .range([quadrantHeight(), 0]);
                    renderAxes(_svg);

                    defineBodyClip(_svg);
                    d3.csv(filename1,function (e,csvdata_1) {
                            var dst = new Array();

                            //console.log(dst);
                            for(var s=0; s<rawdata.length;s++){
                                dist[rawdata[s].w]= Math.abs(csvdata_1[s].x*csvdata_1[s].x+csvdata_1[s].y*csvdata_1[s].y-rawdata[s].x*rawdata[s].x-rawdata[s].y-rawdata[s].y);
                                if(min_dis>dist[rawdata[s].w]){
                                    min_dis=dist[rawdata[s].w];
                                }
                                if (max_dis<dist[rawdata[s].w]){
                                    max_dis=dist[rawdata[s].w];
                                }
                            }

                        renderBody(_svg);
                        }


                    );


                });

                console.log(dist)
//            d3.json("user_tfidf_words.json",function (error,jsondata) {
//                 if(error){
//                console.log(error);
//
//                 }
//                 console.log(jsondata);
//            });
            };

            chart.render= function () {
                     _svg = d3.select(element).append("svg")
                    .attr("height", height)
                    .attr("width", width);

                readData(_svg,filename0,filename1);
            };
         function renderAxes(svg) {
            var axesG = svg.append("g")
                .attr("class", "axes");

        renderXAxis(axesG);

        renderYAxis(axesG);

         }

    function renderXAxis(axesG){

        var xAxis = d3.svg.axis()                       //domain
                .scale(xScale)
                .orient("bottom");

        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(xAxis);

//        d3.selectAll("g.x g.tick")
//            .append("line")
//                .classed("grid-line", true)
//                .attr("x1", 0)
//                .attr("y1", 0)
//                .attr("x2", 0)
//                .attr("y2", - quadrantHeight());
    }

    function renderYAxis(axesG){

        var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left");

        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(yAxis);

//         d3.selectAll("g.y g.tick")
//            .append("line")
//                .classed("grid-line", true)
//                .attr("x1", 0)
//                .attr("y1", 0)
//                .attr("x2", quadrantWidth())
//                .attr("y2", 0);
    }
        function defineBodyClip(svg) {
        var padding = 5;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }
    function renderBody(svg) {
        console.log("dis");
        console.log(min_dis);
        console.log(max_dis);
     quantize.domain([min_dis,max_dis])
            .range(color);
        if (!bodyG) {
            bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate("
                            + xStart() + ","
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");
        }
        renderSymbols();
        renderLegend();
//         d3.csv("relabel_real4_0.3.csv",function (error,community) {
//             if(error){
//                 console.log(error);
//
//             }
//             //console.log(community);
//             renderSymbols(community);
//
//             for(var k=0; k<10; k++) {
//                 console.log(k);
//                 changeCluster(k)
//                }
//         });


    }
    function changeCluster(nodeId) {
            var delay = 1;
            var colorlinear = d3.scale.sqrt().domain([0, 6]).range(["orange","green"]);
            var clor = ["red","purple","green","red","blue","orange"];
            bodyG.selectAll(".node"+nodeId)
                    .transition()
                    .duration(1)
                    .delay(delay)
                    .attr("fill", colorlinear(nodeId));

        }

        function renderLegend(){
                var legend = _svg.selectAll(".legend")
                    .data([0].concat(quantize.range()), function(d) { return d; })
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) {
                        var legendX = i * 16 + width-200;   //set position for each legend element
                        var legendY = height - 40;
                        return "translate(" + legendX + ", " + legendY + ")";
                    });

                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", 1)
                    .attr("width", 16)
                    .attr("height", 8)
                    .style("fill", function (d,i) {
                        return color[i];
                    });

            //legend.exit().remove();

            }
    function renderSymbols() { // <-B




        //console.log(rawdata[0]);
        //console.log(xMark);
        rawdata.forEach(function (list) {

            var circle = bodyG.selectAll("circle")
                .data(rawdata)
                .enter()
                .append("circle")
                .attr("fill", function (d) {
                    console.log(dist[d.w]);
                    return quantize(dist[d.w]);
                })
                .attr("stroke", "gray")
                .attr("cx", function (d) {
                    return xScale(d.x);//设置圆心x坐标
                })
                .attr("cy", function (d) {

                    //console.log(yScale(d[1]));
                    return yScale(d.y);
                })
                .attr("r", 5)//半径
                .attr("class",function (d) {
                return d.w;
            })
        });
//        bodyG.selectAll("text")
//                    .data(rawdata)
//                    .enter().append("text")
//                     .attr("dx", function(d){return xScale(d.x)})
//                    .attr("dy", function(d){return yScale(d.y)})
//                    .attr("text-anchor", "middle")//在圆圈内添加文字
//                    //.style("fill","black")
//
//                    .text(function(d) {
//                        //console.log(d.w);
//                        return d.w;
//                                    })
//                    .attr("class",function (d) {
//                         return d.w;
//
//                                 });
                var Circle = bodyG.selectAll("circle");
                var tooltip = d3.select("body")
                                .append("div")
                                .attr("class","tooltip")
                                .style("opacity",0.0);
            Circle.on("mouseenter",function (d) {
                 //console.log(this.d.x);
                 console.log(d.w);
                 console.log(d.x);
                 console.log(d.y);
                 d3.selectAll("circle")
                     .attr("opacity",0.3);
                 d3.select("body")
                     .selectAll("."+d.w)
                     .attr("fill","red")
                     .attr("opacity",1);
                 d3.selectAll("div")    //?有点不对劲
                         .data(d)
                         .enter()
                         .append("div")
                         .attr("transform",function (d) {
                             return "translate("
                            + xScale(d.x)-20 + ","
                            + yScale(d.y)-20 + ")"
                         });
                 //d3.select(this).attr("fill","lightblue");
                 tooltip.html("words:"+d.w+"<br/>"+"x:" +d.x + "<br />" +
                "y:" + d.y+"<br />"+"dist:"+dist[d.w])
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY+20) + "px")
            .style("opacity", 1.0);
            });
            Circle.on("mouseleave",function (d) {
                d3.select("body").selectAll("."+d.w).attr("fill",function (d) {
                console.log(dist[d.w]);
                return quantize(dist[d.w]);
            });
                d3.selectAll("circle").attr("opacity",1);
                tooltip.style("opacity",0.0);
            });

            function showwords() {
                //var htmls =  $("#ShowWords").html();
                var htmls = "";
                for(var i=0;i<rawdata.length;i++){
                    var names = rawdata[i].w;
                     htmls += '<li>'+'<button onclick=\"SearchEventbyName(this)\"  class=\" listbutton\" id=\"'+rawdata[i].w+'\">'+rawdata[i].w+'</button>'+'</li>';
                }
                $("#ShowWords").html(htmls);
            }
            showwords();


      //  };
    }

    function xStart() {
        return margins.left;
    }

    function yStart() {
        return height - margins.bottom;
    }

    function xEnd() {
        return width - margins.right;
    }

    function yEnd() {
        return margins.top;
    }

    function quadrantWidth() {
        return width - margins.left -margins.right;
    }

    function quadrantHeight() {
        return height - margins.top - margins.bottom;
    }

    chart.width = function (w) {
        if (!arguments.length) return width;
        width = w;
        return chart;
    };

    chart.height = function (h) {
        if (!arguments.length) return height;
        height = h;
        return chart;
    };

    chart.margins = function (m) {
        if (!arguments.length) return margins;
        margins = m;
        return chart;
    };

    chart.colors = function (c) {
        if (!arguments.length) return colors;
        colors = c;
        return chart;
    };

    chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return chart;
    };

    chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return chart;
    };

//    chart.addSeries = function (series) {
//        data.push(series);
//        return chart;
//    };


    return chart

        }
        function DrawWordcloud() {
            getdata();
            function getdata() {
                d3.json("user_tfidf_words_sort.json",function (error,jsondata) {
                 if(error){
                console.log(error);

                 }
                console.log(jsondata[1]);
                DrawCloud(jsondata[1]);
            });

            }
            function DrawCloud(jdata) {


                var fill = d3.scale.category20();
                var layout = d3.layout.cloud()
                        .size([500, 500])
                        .words(jdata.map(function(d) {
                                 console.log(d)
                                 return {text: d[0], size: d[1]*370, test: "haha"};
                                         }))
                        .rotate(function() { return ~~(0) * 90; })
                        .font("Impact")
                        .fontSize(function(d) { return d.size; })
                        .on("end", draw);
                layout.start();

                function draw(words) {
                 d3.select("body").append("svg")
                    .attr("id","WordCloud")
                    .attr("width", layout.size()[0])
                    .attr("height", layout.size()[1])
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size + "px"; })
                    .style("font-family", "Impact")
                    .style("fill","orange")
                    .attr("text-anchor", "middle")
                    .attr("transform", function(d) {
                     return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                             })
                    .text(function(d) { return d.text; });
            }
            }

        }
   // var _chart =  ScatterPlotChart("de_en_sg0.csv");
   //      _chart.render();
   //  var _chart2 = ScatterPlotChart("de_en_sg1.csv");
   //      _chart2.render();

  // var _wordcloud = DrawWordcloud();
        // DrawWordcloud();
        function  SearchEvent() {
            //name = d3.select("#searchbox").value;
            var name = document.getElementById("searchbox").value;
            if (document.getElementById("searchbox").value==""){
                name = d3.select(this).value;
            }
            console.log(d3.select(this).value);
            if (name!=""){
                d3.selectAll("circle")
                    .attr("opacity",0.3);
                d3.select("body")
                    .selectAll("."+name)
                    .attr("fill","red")
                    .attr("opacity",1);
                //d3.select("body").selectAll("."+name).attr("fill","red");
            }
        }
        function  SearchEventbyName(obj) {
            var name = obj.id;

            console.log(obj.id);

            if (name!=""){
                d3.selectAll("circle")
                    .attr("opacity",0.3);
                d3.select("body")
                    .selectAll("."+name)
                    .attr("fill","red")
                    .attr("opacity",1);
                //d3.select("body").selectAll("."+name).attr("fill","red");
            }
        }
        
        function ParallelOrdinates(element,filename){
            var m = [30, 10, 10, 10],
                w = 960 - m[1] - m[3],
                h = 500 - m[0] - m[2];
            var x = d3.scale.ordinal().rangePoints([0,w],.5),
                y ={};
            var line  = d3.svg.line(),
                axis = d3.svg.axis().orient('left'),
                background,
                foreground;


            var po_svg = d3.select(element).append("svg")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("g")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
            d3.csv(filename,function (error,data) {
                if(error) {
                    console.log(error)
                }
            })

        }

        //console.log("mmp");
        Bar("variance_food_sg1.csv");
        function Bar(filename) {
            var margin_bar = {
                top:40,
                bottom:30,
                right:20,
                left:60
            };
            var width_bar=2000-margin_bar.left-margin_bar.right;
            var height_bar = 500-margin_bar.top-margin_bar.bottom;
            //var formatPercent = d3.format(".0%");

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width_bar], .1);

            var y = d3.scale.linear()
                .range([height_bar, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
                //.tickFormat(formatPercent);
            var svg_bar=d3.select("#barchart")
                .append("svg")
                .attr("width",width_bar+margin_bar.left+margin_bar.right)
                .attr("height",height_bar+margin_bar.top+margin_bar.bottom)
                .append("g")
                .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");
            //console.log(svg_bar);
            d3.csv(filename, function(error, data) {
                x.domain(data.map(function(d) { return d.x; }));
                y.domain([0, d3.max(data, function(d) { return d.y; })]);

                svg_bar.append("g")
                    .attr("class", "x_axis_bar")
                    .attr("transform", "translate(0," + height_bar + ")")
                    .call(xAxis);

                svg_bar.append("g")
                    .attr("class", "y_axis_bar")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Variance");

                svg_bar.selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr({
                        class: "bar",x: function (d) {return x(d.x);

                        }, width: x.rangeBand(),y:function (d) {
                            return height_bar;
                        },height:0
                    })
                    .transition().duration(500).delay(200).attr({
                    class: "bar", x: function (d) {return x(d.x);

                    }, width: x.rangeBand(),y:function (d) {
                        return y(d.y);
                    }, height: function (d) {
                        return height_bar-y(d.y);
                    }, fill: "blue"
                    });
                   // .attr("class", "bar")
                    //.attr("x", function(d) { return x(d.x); })
                    //.attr("width", x.rangeBand())
                    //.attr("y", function(d) { return y(d.y); })
                    //.attr("height", function(d) { return height_bar - y(d.y); })
                    //.on('mouseover', tip.show)
                    //.on('mouseout', tip.hide)

            });
            function type(d) {
                d.y = +d.y;
                return d;
            }
        }
