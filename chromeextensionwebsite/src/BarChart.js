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
        var criticalData = []
        var criticalTerms = ['cc', 'creditcard', 'card', 'username', 'password', 'address']
        var visitedWebsites = {}
        for (var i = 0; i < data.length; i++) {
            var currExtensionData = data[i]
            visitedWebsites[data[i].extension_data.url] = (visitedWebsites[data[i].extension_data.url] || 0) + 1
            Object.keys(data[i].extension_data).forEach((key) => {
                if (criticalTerms.includes(key)) {
                    criticalData.push({[key]: data[i].extension_data})
                }
            })
        }
        var visitedWebsitesSorted = Object.entries(visitedWebsites).sort((a, b) => {
            return b[1] - a[1]
        })
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