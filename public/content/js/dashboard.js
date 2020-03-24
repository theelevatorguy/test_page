/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.87429643527204, "KoPercent": 1.125703564727955};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.400562851782364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35, 500, 1500, "Go to delivery page"], "isController": false}, {"data": [0.375, 500, 1500, "Go to product dispensaries page"], "isController": false}, {"data": [0.25, 500, 1500, "Map page with delivery listing"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "Go to about tab on cbd-stores page"], "isController": false}, {"data": [0.25, 500, 1500, "Go to media tab on dispensaries page"], "isController": false}, {"data": [0.24166666666666667, 500, 1500, "Root path"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "Go to media tab on cbd-stores page"], "isController": false}, {"data": [0.5, 500, 1500, "Go to brand page"], "isController": false}, {"data": [0.0, 500, 1500, "Go to reviews tab"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Go to Strain page"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "Go to deals tab on cbd-stores page"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Go to deals page"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "Go to reviews tab on doctors page"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Go to reviews tab on deliveries page"], "isController": false}, {"data": [0.4, 500, 1500, "Go to reviews tab on dispensaries page"], "isController": false}, {"data": [0.5, 500, 1500, "Get token"], "isController": false}, {"data": [0.375, 500, 1500, "Go to about tab on dispensaries page"], "isController": false}, {"data": [0.7023809523809523, 500, 1500, "Get product"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Go to profile page"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "Map page with doctors listing "], "isController": false}, {"data": [0.35, 500, 1500, "Go to deals tab on doctors page"], "isController": false}, {"data": [0.5, 500, 1500, "Go to reviews tab on cbd-stores page"], "isController": false}, {"data": [0.0, 500, 1500, "Go to favorites tab"], "isController": false}, {"data": [0.4, 500, 1500, "Go to media tab on doctors page"], "isController": false}, {"data": [0.0, 500, 1500, "Go to following tab"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Go to media tab on deliveries page"], "isController": false}, {"data": [0.25, 500, 1500, "Map page with dispensary listing"], "isController": false}, {"data": [0.375, 500, 1500, "Go to about tab on deliveries page"], "isController": false}, {"data": [0.5, 500, 1500, "Go to home page "], "isController": false}, {"data": [0.5, 500, 1500, "Go to product brand page"], "isController": false}, {"data": [0.4605263157894737, 500, 1500, "Go to doctor page"], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "Go to product deliveries page"], "isController": false}, {"data": [0.5, 500, 1500, "Go to deals tab on deliveries page "], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "Go to deals tab on dispensaries page"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "Go to dispensariy page"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 533, 6, 1.125703564727955, 1242.4878048780477, 171, 5109, 2017.2000000000003, 2766.8999999999987, 3678.4599999999928, 3.5427994097549953, 322.38213404851246, 9.169928755583399], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Go to delivery page", 50, 0, 0.0, 1396.3, 765, 3757, 1968.9, 2879.2499999999964, 3757.0, 0.49836536161390643, 56.182002329235104, 1.300899066686269], "isController": false}, {"data": ["Go to product dispensaries page", 16, 0, 0.0, 1252.875, 950, 2272, 1816.3000000000004, 2272.0, 2272.0, 0.5145356315924878, 49.72218718846475, 1.3532940329945973], "isController": false}, {"data": ["Map page with delivery listing", 8, 0, 0.0, 1481.5, 999, 2201, 2201.0, 2201.0, 2201.0, 0.39089221147268643, 42.58449035901006, 1.0154035962083454], "isController": false}, {"data": ["Go to about tab on cbd-stores page", 7, 0, 0.0, 1149.857142857143, 632, 1527, 1527.0, 1527.0, 1527.0, 0.10724024879737722, 10.39818986598799, 0.2805182289272911], "isController": false}, {"data": ["Go to media tab on dispensaries page", 12, 0, 0.0, 1584.4999999999998, 619, 3172, 2990.2000000000007, 3172.0, 3172.0, 0.13415315818893236, 12.928737685159307, 0.3497065399664617], "isController": false}, {"data": ["Root path", 60, 0, 0.0, 1677.9500000000005, 591, 5109, 3132.0, 3348.5499999999997, 5109.0, 1.3243863676496557, 121.25621582117472, 3.407966873785979], "isController": false}, {"data": ["Go to media tab on cbd-stores page", 6, 0, 0.0, 1400.3333333333335, 633, 2798, 2798.0, 2798.0, 2798.0, 0.1431229426077, 13.416844079480942, 0.3731353018701398], "isController": false}, {"data": ["Go to brand page", 24, 0, 0.0, 1043.2916666666665, 571, 1396, 1368.5, 1393.0, 1396.0, 1.3891300573016148, 140.49143415017073, 3.5915252213926028], "isController": false}, {"data": ["Go to reviews tab", 3, 3, 100.0, 854.3333333333334, 831, 885, 885.0, 885.0, 885.0, 0.24620434961017645, 0.9499544778416085, 0.6407564372178908], "isController": false}, {"data": ["Go to Strain page", 6, 0, 0.0, 1373.0, 1101, 2197, 2197.0, 2197.0, 2197.0, 0.455719276925414, 47.48188397197326, 1.1757913375360778], "isController": false}, {"data": ["Go to deals tab on cbd-stores page", 11, 0, 0.0, 1346.909090909091, 503, 3311, 3017.6000000000013, 3311.0, 3311.0, 0.12513793613414786, 11.886093104757515, 0.3261651870527741], "isController": false}, {"data": ["Go to deals page", 6, 0, 0.0, 572.0, 491, 790, 790.0, 790.0, 790.0, 0.4798848276413661, 39.686803292209866, 1.237203071262897], "isController": false}, {"data": ["Go to reviews tab on doctors page", 9, 0, 0.0, 1485.5555555555557, 539, 4102, 4102.0, 4102.0, 4102.0, 0.12248230811105063, 11.781200560526674, 0.31997439779531844], "isController": false}, {"data": ["Go to reviews tab on deliveries page", 9, 0, 0.0, 1422.111111111111, 695, 2302, 2302.0, 2302.0, 2302.0, 0.10256410256410256, 11.795250178062679, 0.26851851851851855], "isController": false}, {"data": ["Go to reviews tab on dispensaries page", 10, 0, 0.0, 1608.2, 819, 4242, 4093.5000000000005, 4242.0, 4242.0, 0.1484296146767203, 16.629219111797187, 0.38730852579706704], "isController": false}, {"data": ["Get token", 5, 0, 0.0, 789.0, 715, 864, 864.0, 864.0, 864.0, 0.3561760934606069, 0.9895712752885026, 0.19791425505770052], "isController": false}, {"data": ["Go to about tab on dispensaries page", 12, 0, 0.0, 1404.4166666666667, 642, 3117, 2897.7000000000007, 3117.0, 3117.0, 0.14833494029518654, 14.814867661283346, 0.38733912998467207], "isController": false}, {"data": ["Get product", 42, 0, 0.0, 584.9761904761904, 171, 1275, 853.7000000000007, 1165.8000000000002, 1275.0, 1.3427109974424551, 2.3133729120044757, 3.556148597346547], "isController": false}, {"data": ["Go to profile page", 6, 0, 0.0, 658.0, 444, 1032, 1032.0, 1032.0, 1032.0, 0.4391743522178305, 35.56618895019031, 1.1395373572683354], "isController": false}, {"data": ["Map page with doctors listing ", 6, 0, 0.0, 1250.1666666666665, 988, 1536, 1536.0, 1536.0, 1536.0, 0.3636804461146806, 44.06340209798157, 0.9436513137956115], "isController": false}, {"data": ["Go to deals tab on doctors page", 10, 0, 0.0, 1219.4, 533, 2491, 2465.8, 2491.0, 2491.0, 0.1550652049186683, 15.044050632666035, 0.4046232690846501], "isController": false}, {"data": ["Go to reviews tab on cbd-stores page", 3, 0, 0.0, 1037.0, 706, 1206, 1206.0, 1206.0, 1206.0, 0.060832184280963576, 5.877830597574823, 0.1589914087213075], "isController": false}, {"data": ["Go to favorites tab", 2, 2, 100.0, 551.0, 304, 798, 798.0, 798.0, 798.0, 0.354295837023915, 1.3670145039858284, 0.9227607395925599], "isController": false}, {"data": ["Go to media tab on doctors page", 10, 0, 0.0, 1254.6000000000001, 778, 1886, 1854.7, 1886.0, 1886.0, 0.10927648042311852, 10.370978284031429, 0.2852393598856968], "isController": false}, {"data": ["Go to following tab", 1, 1, 100.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 2.849002849002849, 10.992588141025642, 7.420205662393163], "isController": false}, {"data": ["Go to media tab on deliveries page", 9, 0, 0.0, 1370.4444444444443, 683, 3526, 3526.0, 3526.0, 3526.0, 0.1734304543877905, 16.51915668839365, 0.4539188357517247], "isController": false}, {"data": ["Map page with dispensary listing", 6, 0, 0.0, 1416.3333333333333, 1005, 1913, 1913.0, 1913.0, 1913.0, 0.3268864069735767, 32.10711914328521, 0.8497769681285753], "isController": false}, {"data": ["Go to about tab on deliveries page", 16, 0, 0.0, 1398.5625, 639, 3362, 2970.7000000000003, 3362.0, 3362.0, 0.21061499578770007, 20.711575823866628, 0.5514117580757687], "isController": false}, {"data": ["Go to home page ", 10, 0, 0.0, 808.1999999999999, 567, 1371, 1344.8000000000002, 1371.0, 1371.0, 0.5540780141843972, 50.7021964864528, 1.4349754820478724], "isController": false}, {"data": ["Go to product brand page", 18, 0, 0.0, 917.5555555555557, 539, 1379, 1260.2000000000003, 1379.0, 1379.0, 1.0885999395222257, 104.0100780541276, 2.8700365701542183], "isController": false}, {"data": ["Go to doctor page", 38, 0, 0.0, 1072.0526315789473, 491, 2883, 1748.6000000000001, 2127.7499999999977, 2883.0, 0.4070788876033766, 40.159108507279214, 1.059647937020611], "isController": false}, {"data": ["Go to product deliveries page", 26, 0, 0.0, 1145.0, 573, 1514, 1376.9, 1469.1999999999998, 1514.0, 0.9813542688910696, 92.98711353278101, 2.5824685542009513], "isController": false}, {"data": ["Go to deals tab on deliveries page ", 11, 0, 0.0, 945.6363636363636, 574, 1398, 1377.0, 1398.0, 1398.0, 0.22284348284105182, 21.04545405625785, 0.5831638266784166], "isController": false}, {"data": ["Go to deals tab on dispensaries page", 9, 0, 0.0, 1158.888888888889, 567, 2223, 2223.0, 2223.0, 2223.0, 0.20145044319097502, 19.159104405889067, 0.5249821282679739], "isController": false}, {"data": ["Go to dispensariy page", 56, 0, 0.0, 1478.3035714285713, 761, 3401, 2376.200000000001, 2850.7499999999995, 3401.0, 0.6057852491291837, 69.76602136339544, 1.5751853189026634], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: code expected to match \\\/200\\\/", 6, 100.0, 1.125703564727955], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 533, 6, "Test failed: code expected to match \\\/200\\\/", 6, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Go to reviews tab", 3, 3, "Test failed: code expected to match \\\/200\\\/", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Go to favorites tab", 2, 2, "Test failed: code expected to match \\\/200\\\/", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Go to following tab", 1, 1, "Test failed: code expected to match \\\/200\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
