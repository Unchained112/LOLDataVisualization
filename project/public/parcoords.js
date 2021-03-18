var margin = {top: 90, right: 140, bottom: 20, left: 188},
    width = document.body.clientWidth - margin.left - margin.right - 10, //Vad ska man ha här
    height = 460 - margin.top - margin.bottom,
    innerHeight = height - 2;

var devicePixelRatio = window.devicePixelRatio || 1;
var colorArray = ["#9ddfe3"]
var colors = {
  "Astralis": ["#9ddfe3"],
  "Excel Esports": ["#e4ceb0"],
  "FC Schalke 04 Esports": ["#a94f7f"],
  "Fnatic": ["#cca9a3"],
  "G2 Esports": ["#a67dc0"],
  "MAD Lions": ["#ec87c6"],
  "Misfits Gaming": ["#ff8e43"],
  "Rogue": ["#ebc176"],
  "SK Gaming": ["#f0f277"],
  "Team Vitality": ["#ffc390"]
};
var color = d3.scaleOrdinal()
  .range(colorArray);

function getRandomColor() { // generates a random colour when a player is selected
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
var types = {
  "Number": {
    key: "Number",
    coerce: function(d) {
      return +parseFloat(d); 
    },
    extent: d3.extent,
    within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
    defaultScale: d3.scaleLinear().range([innerHeight, 0])
  },
  "String": {
    key: "String",
    coerce: String,
    extent: function (data) { return data.sort(); },
    within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
    defaultScale: d3.scalePoint().range([0, innerHeight])
  },
  "Date": {
    key: "Date",
    coerce: function(d) { return new Date(d); },
    extent: d3.extent,
    within: function(d, extent, dim) { return extent[0] <= dim.scale(d) && dim.scale(d) <= extent[1]; },
    defaultScale: d3.scaleTime().range([0, innerHeight])
  }
};

var dimensions = [
  {
    key: "Team",
    description: "Teams",
    type: types["String"],
    axis: d3.axisLeft()
      .tickFormat(function(d,i) {
        return d;
      })
  },
  
  {
    key: "GP",
    description: "Games played",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "W%",
    description: "Win percentage",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "CTR%",
    description: "Counter pick rate",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "K",
    description: "Total kills",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "D",
    description: "Total deaths",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "A",
    description: "Total assists",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "KDA",
    description: "Kill/death/assist ratio",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "KP",
    description: "Kill participation",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "KS%",
    description: "Kill share",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "DTH%",
    description: "Average share of team's deaths",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "FB%",
    description: "First blood rate",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "GD10",
    description: "Average gold diff at 10 min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "XPD10",
    description: "Average exp diff at 10 min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "CSD10",
    description: "Average cs score diff at 10 min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "CSPM",
    description: "Average cs score per min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "CS%P15",
    description: "Average share of team's total cs > 15 min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "DPM",
    description: "Average dmg to champs per min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "DMG%",
    description: "Average share of team's total dmg to champs",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "EGPM",
    description: "Average gold earned per min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "GOLD%",
    description: "Average share of team's total gold earned",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "WPM",
    description: "Average wards placed per min",
    type: types["Number"],
    scale: d3.scaleSqrt().range([innerHeight, 0])
  },
  {
    key: "WCPM",
    description: "Average wards cleared per min",
    type: types["String"],
    axis: d3.axisRight()
      .tickFormat(function(d,i) {
        if (d == null) return "(null)";
        return i % 5 == 0 ? d.slice(0,22) : "";
      })
  }
];

var xscale = d3.scalePoint()
    .domain(d3.range(dimensions.length))
    .range([0, width]);

var yAxis = d3.axisLeft();

var container = d3.select(".page").append("div")
    .attr("class", "parcoords")
    .style("width", width + margin.left + margin.right + "px")
    .style("height", height + margin.top + margin.bottom + "px");

var svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var canvas = container.append("canvas")
    .attr("width", width * devicePixelRatio)
    .attr("height", height * devicePixelRatio)
    .style("width", width + "px")
    .style("height", height + "px")
    .style("margin-top", margin.top + "px")
    .style("margin-left", margin.left + "px");

var ctx = canvas.node().getContext("2d");
ctx.globalCompositeOperation = 'darken';
ctx.globalAlpha = 0.15;
ctx.lineWidth = 1.5;
ctx.scale(devicePixelRatio, devicePixelRatio);

var output = d3.select(".page").append("pre");

var axes = svg.selectAll(".axis")
    .data(dimensions)
    .enter().append("g")
    .attr("class", function(d) { return "axis " + d.key.replace(/ /g, "_"); })
    .attr("transform", function(d,i) { return "translate(" + xscale(i) + ")"; });
    

d3.csv("player-stats.csv", function(error, data) {
  if (error) throw error;

  // shuffle the data!
  data = d3.shuffle(data);
  data.forEach(function(d) {
    d.color = colors[d.Team]
    dimensions.forEach(function(p) {
      d[p.key] = !d[p.key] ? null : p.type.coerce(d[p.key]);
    });

    // truncate long text strings to fit in data table
    for (var key in d) {
      if (d[key] && d[key].length > 35) d[key] = d[key].slice(0,36);
    }
  });

  // type/dimension default setting happens here
  dimensions.forEach(function(dim) {
    if (!("domain" in dim)) {
      // detect domain using dimension type's extent function
      dim.domain = d3_functor(dim.type.extent)(data.map(function(d) { return d[dim.key]; }));
    }
    if (!("scale" in dim)) {
      // use type's default scale for dimension
      dim.scale = dim.type.defaultScale.copy();
    }
    dim.scale.domain(dim.domain);
  });

  var render = renderQueue(draw).rate(50);

  ctx.clearRect(0,0,width,height);
  ctx.globalAlpha = d3.min([0.85/Math.pow(data.length,0.3),1]);
  render(data);

  axes.append("g")
      .each(function(d) {
        var renderAxis = "axis" in d
          ? d.axis.scale(d.scale)  // custom axis
          : yAxis.scale(d.scale);  // default axis
        d3.select(this).call(renderAxis);
      })
    .append("text")
      .attr("class", "title")
      .attr("text-anchor", "start")
      .text(function(d) { return "description" in d ? d.description : d.key; });

  // Add and store a brush for each axis.
  axes.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(d.brush = d3.brushY()
          .extent([[-10,0], [10,height]])
          .on("start", brushstart)
          .on("brush", brush)
          .on("end", brush)
        )
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  d3.selectAll(".axis.Team .tick text")
    .style("fill", color);
  //console.log(Object.keys(data.slice(0,24)[0]))
  var dataArr = data.slice(0,-1);
  for (let i=0; i<dataArr.length; i++) {
    var temp = document.getElementById("tableRowTemplate");
    var clon = temp.content.cloneNode(true);
    clon.querySelector(".Player").style.backgroundColor = dataArr[i].color
    clon.querySelector(".Player").textContent = dataArr[i].Player
    clon.querySelector(".Team").textContent = dataArr[i].Team
    clon.querySelector(".Pos").textContent = dataArr[i].Pos
    clon.querySelector(".GP").textContent = dataArr[i].GP
    clon.querySelector(".W").textContent = dataArr[i]["W%"]
    clon.querySelector(".CTR").textContent = dataArr[i]["CTR%"]
    clon.querySelector(".K").textContent = dataArr[i].K
    clon.querySelector(".D").textContent = dataArr[i].D
    clon.querySelector(".A").textContent = dataArr[i].A
    clon.querySelector(".KDA").textContent = dataArr[i].KDA
    clon.querySelector(".KP").textContent = dataArr[i].KP
    clon.querySelector(".KS").textContent = dataArr[i]["KS%"]
    clon.querySelector(".DTH").textContent = dataArr[i]["DTH%"]
    clon.querySelector(".FB").textContent = dataArr[i]["FB%"]
    clon.querySelector(".GD10").textContent = dataArr[i].GD10
    clon.querySelector(".XPD10").textContent = dataArr[i].XPD10
    clon.querySelector(".CSD10").textContent = dataArr[i].CSD10
    clon.querySelector(".CSPM").textContent = dataArr[i].CSPM
    clon.querySelector(".CSP15").textContent = dataArr[i]["CS%P15"]
    clon.querySelector(".DPM").textContent = dataArr[i].DPM
    clon.querySelector(".DMG").textContent = dataArr[i]["DMG%"]
    clon.querySelector(".EGPM").textContent = dataArr[i].EGPM
    clon.querySelector(".GOLD").textContent = dataArr[i]["GOLD%"]
    clon.querySelector(".WPM").textContent = dataArr[i].WPM
    clon.querySelector(".WCPM").textContent = dataArr[i].WCPM

    document.getElementById("tableBody").appendChild(clon);
  }
  function project(d) {
    return dimensions.map(function(p,i) {
      // check if data element has property and contains a value
      if (
        !(p.key in d) ||
        d[p.key] === null
      ) return null;

      return [xscale(i),p.scale(d[p.key])];
    });
  };

  function draw(d) {
    
    ctx.strokeStyle = d.color;
    ctx.beginPath();
    var coords = project(d);
    coords.forEach(function(p,i) {
      // this tricky bit avoids rendering null values as 0
      if (p === null) {
        // this bit renders horizontal lines on the previous/next
        // dimensions, so that sandwiched null values are visible
        if (i > 0) {
          var prev = coords[i-1];
          if (prev !== null) {
            ctx.moveTo(prev[0],prev[1]);
            ctx.lineTo(prev[0]+6,prev[1]);
          }
        }
        if (i < coords.length-1) {
          var next = coords[i+1];
          if (next !== null) {
            ctx.moveTo(next[0]-6,next[1]);
          }
        }
        return;
      }
      
      if (i == 0) {
        ctx.moveTo(p[0],p[1]);
        return;
      }

      ctx.lineTo(p[0],p[1]);
    });
    ctx.stroke();
  }

  function brushstart() {
    d3.event.sourceEvent.stopPropagation();
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    render.invalidate();

    var actives = [];
    svg.selectAll(".axis .brush")
      .filter(function(d) {
        return d3.brushSelection(this);
      })
      .each(function(d) {
        actives.push({
          dimension: d,
          extent: d3.brushSelection(this)
        });
      });

    var selected = data.filter(function(d) {
      if (actives.every(function(active) {
          var dim = active.dimension;
          // test if point is within extents for each active brush
          return dim.type.within(d[dim.key], active.extent, dim);
        })) {
        return true;
      }
    });

    ctx.clearRect(0,0,width,height);
    ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
    render(selected);
    console.log(selected)
    document.getElementById("tableBody").innerHTML= ''
    for (let i=0; i<selected.length; i++) {
      var temp2 = document.getElementById("tableRowTemplate");
      var clon = temp2.content.cloneNode(true);

      clon.querySelector(".Player").style.backgroundColor = selected[i].color

      clon.querySelector(".Player").textContent = selected[i].Player
      clon.querySelector(".Team").textContent = selected[i].Team
      clon.querySelector(".Pos").textContent = selected[i].Pos
      clon.querySelector(".GP").textContent = selected[i].GP
      clon.querySelector(".W").textContent = selected[i]["W%"]
      clon.querySelector(".CTR").textContent = selected[i]["CTR%"]
      clon.querySelector(".K").textContent = selected[i].K
      clon.querySelector(".D").textContent = selected[i].D
      clon.querySelector(".A").textContent = selected[i].A
      clon.querySelector(".KDA").textContent = selected[i].KDA
      clon.querySelector(".KP").textContent = selected[i].KP
      clon.querySelector(".KS").textContent = selected[i]["KS%"]
      clon.querySelector(".DTH").textContent = selected[i]["DTH%"]
      clon.querySelector(".FB").textContent = selected[i]["FB%"]
      clon.querySelector(".GD10").textContent = selected[i].GD10
      clon.querySelector(".XPD10").textContent = selected[i].XPD10
      clon.querySelector(".CSD10").textContent = selected[i].CSD10
      clon.querySelector(".CSPM").textContent = selected[i].CSPM
      clon.querySelector(".CSP15").textContent = selected[i]["CS%P15"]
      clon.querySelector(".DPM").textContent = selected[i].DPM
      clon.querySelector(".DMG").textContent = selected[i]["DMG%"]
      clon.querySelector(".EGPM").textContent = selected[i].EGPM
      clon.querySelector(".GOLD").textContent = selected[i]["GOLD%"]
      clon.querySelector(".WPM").textContent = selected[i].WPM
      clon.querySelector(".WCPM").textContent = selected[i].WCPM
  
      document.getElementById("tableBody").appendChild(clon);
    }
    //output.text(d3.tsvFormat(selected.slice(0,24)));
  }
});

function d3_functor(v) {
  return typeof v === "function" ? v : function() { return v; };
};
