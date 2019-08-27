import React, {Component} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    componentDidMount() {
        console.log('yet')
        this.drawChart();
    }

    loadDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.parseGetData(JSON.parse(xhttp.responseText))
            }
        };
        xhttp.open("GET", 'http://localhost:3001/users', true);
        xhttp.send();
    }

    parseGetData(data) {
        data.map((dataSet) => {
            dataSet.extension_data = JSON.parse(dataSet.extension_data)
            return dataSet
        })
        console.log(data)
    }


    drawChart() {
        console.log('yeet')
        const data = [12, 5, 6, 6, 9, 10];

        const w = 5000

        const h = 100
        const svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("margin-left", 100);

        svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => h - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green")
    }

    render(){
        this.loadDoc()
        return <div id={"#" + this.props.id}></div>
    }
}

export default BarChart;