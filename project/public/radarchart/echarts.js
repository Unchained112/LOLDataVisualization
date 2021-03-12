var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;


d3.csv("player-stats.csv", function(data) {
    let tempArr = [[
        {axis: "KDA", value: data[1].KDA},
        {axis: "Creep Score (CS)", value: data[1].CSD10},
        {axis: "Gold per minute", value: data[1].GD10},
        {axis: "Vision score", value: data[1].WPM},
        {axis: "Damage", value: parseFloat(data[1]['DMG%'])}
    ]]
    option = {
        title: {
            text: 'china'
        },
        legend: {
            data: ['a','b', 'c', 'd']
        },
        radar: [
            {
                indicator: [
                    { text: 'KDA', max: 10, min: -10},
                    { text: 'Creep Score (CS)', max: 10, min: -10 },
                    { text: 'Gold per minute', max: 10, min: -10 },
                    { text: 'Vision score', max: 10, min: -10 },
                    { text: 'Damage', max: 10, min: -10 }
                ],
                center: ['25%', '50%'],
                radius: 120,
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                name: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#72ACD1'
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['rgba(114, 172, 209, 0.2)',
                            'rgba(114, 172, 209, 0.4)', 'rgba(114, 172, 209, 0.6)',
                            'rgba(114, 172, 209, 0.8)', 'rgba(114, 172, 209, 1)'],
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.5)'
                    }
                }
            }
        ],
        series: [
            {
                name: 'radar',
                type: 'radar',
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                },
                data: [
                    {
                        value: [data[1].KDA, data[1].CSD10, data[1].GD10, data[1].WPM, parseFloat(data[1]['DMG%'])],
                        name: 'a',
                        symbol: 'rect',
                        symbolSize: 5,
                        lineStyle: {
                            type: 'solid'
                        },
                        emphasis: {
                            label: 'show'
                        }
                    }
                    // ,{
                    //     value: [60, 5, 0.30, -100, 1500],
                    //     name: 'b',
                    //     areaStyle: {
                    //         color: 'rgba(255, 255, 255, 0.5)'
                    //     }
                    // }
                ]
            }
        ]
    }
    
    console.log(data)
    //return RadarChart("#radarChart", tempArr, radarChartOptions);
    myChart.setOption(option);
})
