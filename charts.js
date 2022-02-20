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

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleResultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    
    var sampleResult = sampleResultArray[0];
    console.log(sampleResultArray);
    console.log(sampleResult);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadataResult = metadataResultArray[0];
    console.log(metadataResult);
    

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = sampleResult.otu_ids;
    var otu_labels = sampleResult.otu_labels;
    var sample_values = sampleResult.sample_values;

    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);


    // 3. Create a variable that holds the washing frequency.
    var frequency = metadataResult.wfreq;
   
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    
    
    var sortedbyMostBacteria = sampleResultArray.sort((a, b) => a.sample_values - b.sample_values).reverse();
    var topTenIds = sortedbyMostBacteria.map(bacteria => bacteria.otu_ids)[0].slice(0, 10);
    var topTenValues = sortedbyMostBacteria.map(bacteria => bacteria.sample_values)[0].slice(0, 10);
    
    
    console.log(sortedbyMostBacteria);
    console.log(topTenIds);
    console.log(topTenValues);


    var yticks = topTenIds.map(id => 'OTU' + id);
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barTrace = { 
      x: topTenValues.reverse(),
      y: yticks.reverse(),
      type: 'bar',
      orientation: 'h',
       
      
    };
    
    var barData = [barTrace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Value" },
          };

    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


     
    // // Use Plotly to plot the bubble data and layout.
    // 1. Create the trace for the bubble chart.
    var bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          // colorscale: 'YlGnBu'
          colorscale: 'Earth' 
        }
      };
      
      var bubbleData = [bubbleTrace];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: 'Bacteria Cultures per Sample',
        xaxis: {title: "OTU ID"}
      };
        
      
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
  
  
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = {
      domain: { x: [0, 1], y: [0, 1] },
      value: frequency,
      // title: {text: "".append("h4").text("Belly Button Washing Frequency").append("h6").text("Scrubs per Week")},
      

      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" },
        ],
        bar: { color: "black" },
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 9},
    }};
    
    var data = [gaugeData];
     
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 700, 
      height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', data, gaugeLayout);
  });
};

