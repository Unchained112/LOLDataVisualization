
/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

//////////////////////////////////////////////////////////////
//////////////////////// Set-Up //////////////////////////////
//////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////
////////////////////////// Data //////////////////////////////
//////////////////////////////////////////////////////////////

//var loadedData = []

// d3.csv("player-stats.csv").then(function (data) {
//     //console.log(data); // [{"Hello": "world"}, �]
//     loadedData = data
// });

// console.log(loadedData)

var avgVis = 0
var avgStat = 0
var avgProg = 0
var avgHcp = 0
var avgEval = 0
var avgColl = 0

// for (let i = 0; i < loadedData.length; i++) {
//     loadedData.push({
//         alias: data[i].alias,
//         selected: false,
//         data:
//         [
//         { axis: "Information Visualization", value: data[i].information_visualization },
//         { axis: "Statistical", value: data[i].statistics },
//         { axis: "Programming", value: data[i].programming },
//         { axis: "Human-computer interaction programming", value: data[i].hcp },
//         { axis: "Evaluating", value: data[i].evaluation },
//         { axis: "Collaboration", value: data[i].collaboration }
//             ]
//     })
//     avgVis += data[i].information_visualization
//     avgStat += data[i].statistics
//     avgProg += data[i].programming
//     avgHcp += data[i].hcp
//     avgEval += data[i].evaluation
//     avgColl += data[i].collaboration
// }

// avgVis = avgVis / loadedData.length
// avgStat = avgStat / loadedData.length
// avgProg = avgProg / loadedData.length
// avgHcp = avgHcp / loadedData.length
// avgEval = avgEval / loadedData.length
// avgColl = avgColl / loadedData.length

// var avgData = [
//     [
//         { axis: "Information Visualization", value: avgVis },
//         { axis: "Statistical", value: avgStat },
//         { axis: "Programming", value: avgProg },
//         { axis: "Human-computer interaction programming", value: avgHcp },
//         { axis: "Evaluating", value: avgEval },
//         { axis: "Collaboration", value: avgColl }
//     ]]

// for (let i = 0; i < loadedData.length; i++) {
//     let nameTag = document.createElement("div")
//     console.log(nameTag)

//     let node = document.createTextNode(loadedData[i].alias);
//     let checkBox = document.createElement("input")
//     checkBox.type = "checkbox"
//     checkBox.className = "form-check-input"
//     if (loadedData[i].selected) {
//         checkBox.checked = true
//     } else {
//         checkBox.checked = false
//     }
//     nameDiv.appendChild(nameTag)
//     nameTag.id = loadedData[i].alias
//     checkBox.id = loadedData[i].alias + "_checkbox"
//     nameTag.appendChild(checkBox)
//     nameTag.appendChild(node)
// }

// function updateNames() {
//     outputData = []
//     let selectedAvg = [
//         { axis: "Information Visualization", value: 0 },
//         { axis: "Statistical", value: 0 },
//         { axis: "Programming", value: 0 },
//         { axis: "Human-computer interaction programming", value: 0 },
//         { axis: "Evaluating", value: 0 },
//         { axis: "Collaboration", value: 0 }
//     ]
    
//     for (let i = 0; i < loadedData.length; i++) {
//         var checkbox = document.getElementById(loadedData[i].alias + "_checkbox");
//         if (checkbox.checked == true) {
//             loadedData[i].selected = true
//         } else {
//             loadedData[i].selected = false
//         }
//         if (loadedData[i].selected) {
//             outputData.push(loadedData[i].data)
//         }
//     }
//     if (outputData.length != 0) {
//         for (let i = 0; i < outputData.length; i++) {
//             for (let j = 0; j < outputData[i].length; j++) {

//                 selectedAvg[j].value += outputData[i][j].value
//             }
//         }
//         console.log(selectedAvg)
//         selectedAvg[0].value = selectedAvg[0].value / outputData.length
//         selectedAvg[1].value = selectedAvg[1].value / outputData.length
//         selectedAvg[2].value = selectedAvg[2].value / outputData.length
//         selectedAvg[3].value = selectedAvg[3].value / outputData.length
//         selectedAvg[4].value = selectedAvg[4].value / outputData.length
//         selectedAvg[5].value = selectedAvg[5].value / outputData.length

//     } else {
//         outputData = [selectedAvg]
//     }
//     if (avgData.length >= 2) {
//         avgData.splice(1, 1)
//     }
//     avgData.push(selectedAvg)
//     RadarChart("#radarChart", outputData, radarChartOptions);
//     RadarChart("#radarChart2", avgData, radarChartOptions);
// }


//console.log(loadedData[names.indexOf("Rella666")])

//////////////////////////////////////////////////////////////
//////////////////// Draw the Chart //////////////////////////
//////////////////////////////////////////////////////////////


//Call function to draw the Radar chart
//RadarChart("#radarChart", outputData, radarChartOptions);