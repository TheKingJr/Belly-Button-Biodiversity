function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    // Create a variable that holds the washing frequency
    var wfreq = result.wfreq;

    // Checking that the code is working
    console.log(wfreq)
   
     // 4. Create the trace for the gauge chart.
     var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "Belly Button Washing Frequency".italics().bold(), font: {size: 22} },
        legend: "Scrubs per Week",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], tickwidth:2, tickcolor: "black"},
          bar: { color: "black"},
          bgcolor: "black",
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0,2], color: "red", legendText: 'Scrubs per Week'},
            { range: [2,4], color: "orange", legendText: 'Scrubs per Week'},
            { range: [4,6], color: "yellow", legendText: 'Scrubs per Week'},
            { range: [6,8], color: "lightgreen", legendText: 'Scrubs per Week'},
            { range: [8,10], color: "green", legendText: 'Scrubs per Week'}
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: wfreq
          }

        }
      }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 457.5,
      height: 370,
      paper_bgcolor: "white",
      showlegend: true,
      annotations: [{
        x: 0.5,
        xanchor: 'center',
        y: 0.01,
        yanchor: 'center',
        text: "Scrubs per Week",
        font: {size: 15},
        showarrow: false
      }]
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot(gauge, gaugeData, gaugeLayout);

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var metadata = data.samples

    // Checking that the code is working
    console.log(metadata)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

      //Sorting the results array before continuing 
      var SortedVals = resultArray.sort((a,b) => a.sample_values - b.sample_values);
    //  5. Create a variable that holds the first sample in the array.
    var result = SortedVals[0];
  
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_vals = result.sample_values;

    let otu_ids_bar = otu_ids.slice(0);
    let otu_labels_bar = otu_labels.slice(0);
    let sample_vals_bar = sample_vals.slice(0);

    // Checking that the code is working
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_vals);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var trash = otu_ids_bar.splice(0,10);

    var yticks = trash.map(value => `OTU ${value}`);

    // Checking that the code is working
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = {
      x:  sample_vals_bar.splice(0,10).reverse(),
      y:  yticks.reverse(),
      text: otu_labels_bar.splice(0,10).reverse(),
      type: "bar",
      orientation: 'h'
    
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      width: 380,
      height: 370,
      title: "Top 10 Bacteria Cultures Found".italics().bold(),
      xaxis: {title: "# of Bacteria"},
      hovermode: "closest"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_vals,
      text: otu_labels,
      mode: 'markers',
      type: "bubble",
      marker: {
        size: sample_vals,
        sizeref: 0.03,
        sizemode: "area",
        opacity: 0.6,
        color: otu_ids,
        colorscale: "YlOrRd"
      }
   
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "Bacteria Cultures Per Sample".italics().bold(), font: {size:30}},
      xaxis: {title: "OTU ID"},
      yaxis: {title: "# of Bacteria"},
      showlegend: false,
      margin: {t: 65},
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

  });
}
