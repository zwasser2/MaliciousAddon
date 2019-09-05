import React, {Component} from 'react';
import './App.css';
import BarChart from './BarChart'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            mostVisitedWebsiteList : [],
            criticalData: [],
            hasGetRequested: false
        }
    }
    loadDoc() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                this.setState({data: JSON.parse(xhttp.responseText)})
                this.parseGetData()
                //this.drawChart()
            }
        };
        xhttp.open("GET", 'http://localhost:3001/users', true);
        xhttp.send();
    }

    parseGetData() {
        var tempData = this.state.data
        tempData = tempData.map((website) => {
            website.extension_data = JSON.parse(website.extension_data)
            return website
        })
        this.setState({data: tempData})
        var criticalData = []
        var criticalTerms = ['cc', 'creditcard', 'card', 'username', 'password', 'address']
        var visitedWebsites = {}
        for (var i = 0; i < this.state.data.length; i++) {
            if (typeof this.state.data[i].extension_data.url === 'undefined') {
                visitedWebsites['No Given URL'] = (visitedWebsites['No Given URL'] || 0) + 1
            } else if (this.state.data[i].extension_data.url.includes('aws.amazon')) {
                visitedWebsites['aws.amazon'] = (visitedWebsites['aws.amazon'] || 0) + 1
            } else {
                var substringStartIndex = 0
                if (this.state.data[i].extension_data.url.substring(0, 5) === 'https') {
                    if (this.state.data[i].extension_data.url.substring(8,11) === 'www') {
                        substringStartIndex = 12
                    } else {
                        substringStartIndex = 8
                    }
                } else {
                    if (this.state.data[i].extension_data.url.substring(7,10) === 'www') {
                        substringStartIndex = 11
                    } else {
                        substringStartIndex = 7
                    }
                }
                var url = this.state.data[i].extension_data.url.substring(substringStartIndex, this.state.data[i].extension_data.url.length + 1)
                visitedWebsites[url] = (visitedWebsites[url] || 0) + 1
            }
            Object.keys(this.state.data[i].extension_data).forEach((key) => {
                if (criticalTerms.includes(key)) {
                    criticalData.push({[key]: this.state.data[i].extension_data})
                }
            })
        }
        var visitedWebsitesSorted = Object.entries(visitedWebsites).sort((a, b) => {
            return b[1] - a[1]
        })
        this.setState({mostVisitedWebsiteList: visitedWebsitesSorted})
        this.setState({criticalData: criticalData})
    }

    findWebsite(query) {
        return this.state.data.filter((website) => {
            return website.extension_data.url && website.extension_data.url.toLowerCase().includes(query)
        })
    }

    findByKey(query) {
        return this.state.data.filter((website) => {
            return Object.keys(website.extension_data).includes(query)
        })
    }

    findByValue(query) {
        return this.state.data.filter((website) => {
            const keys = Object.keys(website.extension_data)
            for (var i = 0; i < keys.length; i ++) {
                if (website.extension_data[keys[i]].toLowerCase().includes(query)) {
                    return true
                }
            }
            return false
        })
    }

    render() {
        if (!this.state.hasGetRequested) {
            this.setState({hasGetRequested: true})
            this.loadDoc()
        }
        return (<div id='graphic'>
            <h1>Malicious Chrome Extension</h1>
            <h2>Purpose</h2>
            <h3>The purpose of this extension is to take a look at the potential vulnerabilities that are can be exploited by a malicious Chrome extension. To test what can be stolen, I let the Chrome Extension run in the background of my computer for about 4 days to see what could potentially be in the hands of strangers. In addition, I wanted to play around with some basic D3.JS and felt that the info I gatherered would be very suitable for it.</h3>
            <h2>Chrome Extension</h2>
            <h3>The Chrome Extension is avaliable in the app store at the following link: TBD. <br/>I wanted to make this a little interactive for people to use, so the website will be built such that any person can download the chrome extension and have their own data stolen! To have your data stolen, download the extension, go to any website that has a form with text based input fields (IE where you would enter a credit card) and enter any data you want into the field. Following either clicking a 'submit' button or leaving the page, the data will be avaliable on this website. Please do not write anything that you would not want any random person to see. If you need something removed, feel free to send me an email at 'zacharyswasserman@gmail.com'.</h3>
            <h2>How it works</h2>
            <h3>The stealing form data is based on the following stipulations: </h3>
            <h4>
                <ul>
                    <li>The Chrome extension can be active on any given page</li>
                    <li>That HTML can be read off every page from the Chrome Extension</li>
                    <li>Data can be sent from the Chrome Extension to a database</li>
                </ul>
            </h4>
            <h3>
                The first is possible, but only if the extension asks for 'Read and change all your data on websites you visit" permission. This is not a particuarly outlandish permission. Many common apps like 'Grammarly' or 'LastPass' use this.
                <br/>
                The second is possible. It can easily be done like any other Javascript running on a page by searching the page for a certain tag name. In my case I found the fields I needed by looking for with tag name 'input' and the buttons with tag name 'button'. From there it was some basic filtering to find the button / input fields I wanted
                <br/>
                The third is possible. This can be done by setting up:</h3>
            <h4>
                <ol>
                    <li>Setting up a database: Done using Amazon RDS</li>
                    <li>Creating an API endpoint for the database: Done using Express / Node.JS</li>
                    <li>Using an AJAX request to POST data to the database: Done using Vanilla Javascript</li>
                </ol>
            </h4>
            <h2>What can be stolen</h2>
            <h3>Realistically, anything can be stolen that is typed out by a human. Just searching for input tags with a basic way to identify the field (IE Is it a password field? Is it a username field? Is it a credit card field?) means that I could take info accuratly from most websites. This can be because of design patterns that most coders follow which makes it easier for me to predict what data I need to get off of a page.
                The following were stolen from me over 4 days:</h3>
            <h4>
                <ul>
                    <li>Credit Card Information</li>
                    <li>Home Address</li>
                    <li>Phone Number</li>
                    <li>Username / Password credentials for specific sites</li>
                    <li>My Search History</li>
                </ul>
            </h4>
            <h2>Interactive</h2>
            <h3>Below are some basic presentations of some of the data that I had stolen from me. In addition, some graphs will be included at the bottom for information stolen from other users in addition to my own. I did write over my own sensitive data with mock data. But otherwise, everythign is as was stolen.</h3>
            <BarChart mostVisitedWebsiteList={this.state.mostVisitedWebsiteList}/>
        </div>)
    }
}

export default App;
