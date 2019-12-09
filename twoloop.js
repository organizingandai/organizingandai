// var svg = d3.select("svg");
//
// var circle = svg.selectAll("circle")
//     .data([32, 57, 112, 293]);
//
// var circleEnter = circle.enter().append("circle");
// circleEnter.attr("cy", 60);
// circleEnter.attr("cx", function(d, i) { return i * 100 + 30; });
// circleEnter.attr("r", function(d) { return Math.sqrt(d); });

// data_as_json = d3.csv("https://raw.githubusercontent.com/johnhaldeman/talk-on-d3-basics/master/Summary_sommaire_2017_2026.csv");
base_width = 25;
accent_width = 45;

data_as_json = [
  {
    label: "",
    key: "aviation",
    tag: "Aviation",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "ethics",
    tag: "Ethics and Philosophy of Technology",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "space",
    tag: "Space Industry",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "quantum",
    tag: "Human and machine teaming",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "management",
    tag: "",
    Employment: "2",
    radius: base_width
  },
  {
    label: "This Tutorial Session",
    key: "tutorial",
    tag: "Assessing the intersection of Organizational Structure and FAT* efforts within industry",
    Employment: "1",
    radius: accent_width
  },
  {
    label: "",
    key: "sts",
    tag: "Science And Technology Studies",
    Employment: "2",
    radius: base_width
  },
  {
    label: "",
    key: "fat",
    tag: "FAT* 2019 Translation Tutorial: Challenges of incorporating algorithmic fairness into industry practice",
    Employment: "0",
    radius: base_width
  },
  {
    label: "",
    key: "ot",
    tag: "Organizational Theory",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "about",
    tag: "ABOUT ML PAI Initiative",
    Employment: "2",
    radius: base_width
  },
  {
    label: "",
    key: "cs",
    tag: "Computer Science",
    Employment: "1",
    radius: base_width
  },
  {
    label: "",
    key: "ethn",
    tag: "Ethnography",
    Employment: "2",
    radius: base_width
  },
  {
    label: "+",
    key: "add",
    tag: "Add New",
    Employment: "1",
    radius: accent_width
  }
];

width = 900;
height = 500;
circle_color = "#ffd271"; // "#"
circle_selected_color = "#f65c78";
arrow_color = "#828282";

function flatNodeHeirarchy() {
  root = {children: data_as_json}; // remove the first value from the dataset - which is an aggregate we don't need
  return d3.hierarchy(root).sum(d => d.Employment);
}

function packedData() {
  pack = d3.pack()
      .size([width, height])
      .padding(10)
  root = d3.hierarchy({children: data_as_json}).sum(d => d.Employment);
  pack(root);
  return root.descendants();
}

const svg = d3.select("#timeline")
    .style("width", "100%")
    .style("height", height)
    .attr("font-size", 14)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle");

packed = packedData()
const leaf = svg.selectAll("g")
  .data(packed[0].children)
  .enter().append("g")
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

const circle = leaf.append("circle")
    .attr("id", d => "circle_" + d.data.key)
    .attr("r", d => d.data.radius)
    .attr("fill", d => circle_color);



leaf.append("text")
    // .attr("clip-path", d => d.clipUid)
  .selectAll("tspan")
  .data(d => d.data.label.split(/(?=[A-Z][^A-Z])/g))
  .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text(d => d);

format = d3.format(",d")
current_circle = undefined;
$("div[id^='details-popup-']").hide();

function selectOccupation(d) {

  $("div[id^='details-popup-']").hide();
  $("#circle_tutorial").attr("fill", circle_color);

  if(d.data.key == "add") {
    window.location.href = "https://forms.gle/Z4gzgoAD1qi5ixTdA";
  }

  // cleanup previous selected circle
  if(current_circle !== undefined){
    current_circle.attr("fill", d => circle_color);
    // d3.selectAll("#details-popup-").attr("display", "none");  //remove();
  }

  // select the circle
  current_circle = d3.select(this);
  current_circle.attr("fill", circle_selected_color);

  // textblock = d3.select("#details-popup-" + d.data.key);
  // textblock.attr("display", "inherit");
  $("#details-popup-" + d.data.key).show();

}

circle.on("click", selectOccupation)
      .on("mouseover", function(d,i){
        tooltip = d3.select("#circle-tooltip");
        tooltip.text(d.data.tag);
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function(d,i){
        tooltip = d3.select("#circle-tooltip");
        return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(d,i){
        tooltip = d3.select("#circle-tooltip");
        return tooltip.style("visibility", "hidden");
      });
      //.on("mouseover", handleMouseOver)
      //.on("mouseout", handleMouseOut);

$("#details-popup-tutorial").show();
$("#circle_tutorial").attr("fill", circle_selected_color);

// Upper Arrow -------------------------------------------
xEnd = 700;
xStart = 25;
xStep = (xEnd - xStart)/3;
var up_arrow_data = [{x: xStart, y: 200}, {x: xStart+1.5*xStep, y: 0}, {x: xStart+2.5*xStep, y: 0}, {x:xStart+2.8*xStep, y: 75},  {x:xEnd, y: 150}]
var curveFunc = d3.line()
  .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
  .x(function(d) { return d.x })
  .y(function(d) { return d.y })

svg.append('path')
  .attr('d', curveFunc(up_arrow_data))
  .attr("class", "arrow")
  .attr("marker-end", "url(#arrowhead)")
  .attr('stroke', arrow_color)
  .attr('fill', 'none');

// Lower Arrow
xEnd_low = 900;
xStart_low = xStart+2*xStep;
xStep_low = (xEnd_low - xStart_low)/3;
var down_arrow_data = [
  {x: xStart_low, y: 350},
  {x: xStart_low+1.5*xStep_low, y: 400},
  {x: xStart_low+2.5*xStep_low, y: 275},
  {x: xEnd_low, y: 150}]
var curveFunc = d3.line()
  .curve(d3.curveBasis)              // This is where you define the type of curve. Try curveStep for instance.
  .x(function(d) { return d.x })
  .y(function(d) { return d.y })

svg.append('path')
  .attr('d', curveFunc(down_arrow_data))
  .attr("class", "arrow")
  .attr("marker-end", "url(#arrowhead)")
  .attr('stroke', arrow_color)
  .attr('fill', 'none');
// ----------------------------------------------


// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

      // Use D3 to select element, change color and size
      d3.select(this)
        .transition()
        .ease(d3.easeSin)
        .duration(100)
        .attr("r", d => d.data.radius * 2)
        .style("fill-opacity", 1)
        .attr("fill", d => circle_selected_color);

      // // Specify where to put label of text
      // svg.append("text").attr({
      //    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
      //     x: d.x - 30,
      //     y: d.y - 15
      // })
      // .text(d.data.tag);

      svg.append("text")
        .attr("id", "t_" + d.data.key)
        // .attr("x", d.x)
        // .attr("y", d.y)
        // .selectAll("tspan")
        //.data(d => d.data.tag.split(/(?=[A-Z][^A-Z])/g))
        .join("tspan")
          .attr("x", d.x)
          .attr("y", d.y)
          .text(d.data.tag)
          .call(wrap, d.data.radius * 2);
    }

function handleMouseOut(d, i) {
      // Use D3 to select element, change color back to normal
      d3.select(this).attr("r", d => d.data.radius)
                     .attr("fill", d => circle_color);

      // Select text by id and then remove
      d3.select("#t_" + d.data.key).remove();  // Remove text location
    }

    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                            .append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                                .attr("x", x)
                                .attr("y", y)
                                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                .text(word);
                }
            }
        });

}

function type(d) {
  d.value = +d.value;
  return d;
}
