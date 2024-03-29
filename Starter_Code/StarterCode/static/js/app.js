d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    // Populate Dropdown Menu
    data.names.forEach(name => {
        d3.select("#selDataset").append("option").text(name).property("value", name);
    });

    // Initialize dashboard with the first sample
    updateDashboard(data.names[0]);
});

function updateDashboard(sampleId) {
    // Filter data for the selected ID
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
        var sample = data.samples.filter(obj => obj.id === sampleId)[0];
        var metadata = data.metadata.filter(obj => obj.id === parseInt(sampleId))[0];

        // Create Bar Chart
        var barData = [{
            x: sample.sample_values.slice(0, 10).reverse(),
            y: sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: sample.otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];
        Plotly.newPlot('bar', barData);

        // Create Bubble Chart with adjusted size
        var bubbleData = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: 'Earth'
            }
        }];
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
            showlegend: false,
            height: 600, // Adjusted height
            width: 1200  // Adjusted width
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);

        // Display Metadata
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html(""); // Clear existing metadata
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key}: ${value}`);
        });
    });
}

function optionChanged(newSampleId) {
    // Update dashboard with newly selected sample ID
    updateDashboard(newSampleId);
}
