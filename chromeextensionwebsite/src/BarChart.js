import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasDrawn: false
        }
    }





        findWebsite(data, query) {
            return data.filter((website) => {
                return website.extension_data.url && website.extension_data.url.toLowerCase().includes(query)
            })
        }

        findByKey(data, query) {
            return data.filter((website) => {
                return Object.keys(website.extension_data).includes(query)
            })
        }

        findByValue(data, query) {
            return data.filter((website) => {
                const keys = Object.keys(website.extension_data)
                for (var i = 0; i < keys.length; i ++) {
                    if (website.extension_data[keys[i]].toLowerCase().includes(query)) {
                        return true
                    }
                }
                return false
            })
        }


        drawChart() {
            console.log(this)
            console.log(this.props)
            const data = this.props.mostVisitedWebsiteList
            console.log(data)
            const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            //set up svg using margin conventions - we'll need plenty of room on the left for labels
            var margin = {
                top: 15,
                right: 25,
                bottom: 15,
                left: 500
            };

            var width = h - margin.left - margin.right,
                height = w - margin.top - margin.bottom;

            var svg = d3.select("#graphic").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

            var x = d3.scaleLinear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d[1];
                })]);

            var y = d3.scaleBand()
                .range([height, 0], .1)
                .domain(data.map(function (d) {
                    return d[0];
                }));

            //make y axis to show bar names
            var yAxis = d3.axisLeft(y)

            var gy = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            var bars = svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")

            //append rects
            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d,i) {
                    return y(d[0]);
                })
                .attr("height", h / (data.length * 2.5))
                .attr("x", 0)
                .attr("width", function (d) {
                    return x(d[1]);
                })

            //add a value label to the right of each bar
            bars.append("text")
                .attr("class", "label")
                //y position of the label is halfway down the bar
                .attr("y", function (d) {
                    return y(d[0]) + y.range()[1] / 2 + h /(data.length * 2.5);
                })
                //x position is 3 pixels to the right of the bar
                .attr("x", function (d) {
                    return x(d[1]) + 3;
                })
                .text(function (d) {
                    return d[1];
                });
    }

    render(){
        if (!this.state.hasDrawn && this.props.mostVisitedWebsiteList.length !== 0) {
            this.drawChart()
            this.setState({hasDrawn: true})
        }
        return (<div id='graphic'></div>)
    }
}

export default BarChart;