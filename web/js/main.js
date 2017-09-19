/**
 *
 * Active Charts using Highcharts demonstration
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Script Tutorials
 * http://www.script-tutorials.com/
 */

// Change Chart type function
function ChangeChartType(chart, series, newType) {
    newType = newType.toLowerCase();
    for (var i = 0; i < series.length; i++) {
        var srs = series[0];
        try {
            srs.chart.addSeries({
                type: newType,
                stack: srs.stack,
                yaxis: srs.yaxis,
                name: srs.name,
                color: srs.color,
                data: srs.options.data
            },
            false);
            series[0].remove();
        } catch (e) {
        }
    }
}

// Two charts definition
var chart1, chart2;
var biaoData, temp;

// Once DOM (document) is finished loading
$(document).ready(function() {
    biaoData = eval($.ajax({url:"/datas/getMonthData", async:false}).responseText);
    // First chart initialization
    chart1 = new Highcharts.Chart({
     chart: {
        renderTo: 'chart_1',
        type: 'column',
        height: 350,
     },
     title: {
        text: '一年各月份收入与支持分析'
     },
     xAxis: {
        categories: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份']
     },
     yAxis: {
        title: {
           text: '总金额'
        }
     },
     series: biaoData
    });

    // Second chart initialization (pie chart)
	temp = eval($.ajax({url:"/datas/getAllData", async:false}).responseText);
    chart2 = new Highcharts.Chart({
        chart: {
            renderTo: 'chart_2',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 350,
        },
        title: {
            text: '一年总收入与总支出'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage}%  {point.config} 元</b>',
            percentageDecimals: 1
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
         series: temp
    });

    // Switchers (of the Chart1 type) - onclick handler
    $('.switcher').click(function () {  
        var newType = $(this).attr('id');
        ChangeChartType(chart1, chart1.series, newType);
    });
});