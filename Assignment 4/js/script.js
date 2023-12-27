const myColors = [
    "Blue",
    "Orange",
    "Purple",
    "Green",
    "Red",
    "Turquoise",
    "Magenta",
    "Yellow",
    "Teal",
    "Pink",
    "Lime",
];

function dot_plot(is_multiple, canvas_name) {
    let base_radius = 2;
    var width = window.innerWidth * 0.9,
        height = 0.6 * width;

    // Load GeoJSON data and display the map
  Promise.all([
    d3v5.csv("../data/usa_top10.csv"),
    d3v5.json("../data/usaRegs.json")
  ]).then(function (results) {
    const data = results[0];
    const world = results[1];

    const canvas = d3v5.select(canvas_name)
      .attr("width", width)
      .attr("height", height);

            const context = canvas.node().getContext("2d");

            var allYears = Object.keys(data[0]).slice(1);

            if (is_multiple) {
                const legendWidth = 120;
                const legendHeight = myColors.length * 20;
                const legendX = 10;
                const legendY = 10;

                context.save();
                context.fillStyle = "rgba(0, 0, 0, 0.002)";
                context.fillRect(legendX, legendY, legendWidth, legendHeight);

                let legendItems = [];
                myColors.forEach((color, i) => {
                    const dotX = legendX + 10;
                    const dotY = legendY + 10 + i * 20;

                    legendItems.push({
                        color: color,
                        dotX: dotX,
                        dotY: dotY,
                        labelX: dotX + 10,
                        labelY: dotY + 4,
                        year: allYears[i]
                    });
                });

                legendItems.forEach(item => {
                    context.beginPath();
                    context.fillStyle = item.color;
                    context.fillRect(item.dotX, item.dotY, 5, 5);

                    context.font = "13px Roboto";
                    context.fillStyle = "black";
                    context.fillText(item.year, item.labelX, item.labelY);
                });

                context.restore();
            }

            const projection = d3v5.geoAlbersUsa()
                .scale(width)
                .translate([width / 2, height / 2]);

            const path = d3v5.geoPath().projection(projection).context(context);
            const path_ = d3v5.geoPath().projection(projection);

            world.features.forEach(function (feature) {
                let state = data.find(d => d.state === feature.properties.name);

                if (state) {
                    context.beginPath();
                    path(feature);
                    context.lineWidth = 0.7;
                    context.strokeStyle = "black";
                    context.stroke();
                }
            });

            world.features.forEach(function (feature) {
                feature.properties.area = path_.area(feature);
                feature.properties.bounds = path_.bounds(feature);
            });

            let max_trees = d3v5.max(data, d => d3v5.sum(Object.values(d).slice(1).map(el => +el)));
            let max_state_area = d3v5.max(world.features, d => d.properties.area);

            world.features.forEach(function (feature) {
                context.save()
                context.beginPath();
                path(feature);
                context.clip()

                let x = feature.properties.bounds[0][0]
                let y = feature.properties.bounds[0][1]
                let w = feature.properties.bounds[1][0] - x
                let h = feature.properties.bounds[1][1] - y

                let state = data.find(d => d.state === feature.properties.name);

                if (state) {
                    let stateValues = Object.values(state).slice(1).map(el => +el);
                    let relative_tree_count = d3v5.sum(stateValues) / max_trees;
                    let relative_state_area = feature.properties.area / max_state_area;
                    let state_box_area = w * h;

                    let real_density = relative_tree_count / relative_state_area;
                    let box_density = real_density;
                    let radius = base_radius / Math.sqrt(box_density);

                    let points = createPoints(w, h, radius);
                    points.forEach(d => {
                        d[0] += x;
                        d[1] += y;
                    });

                    points.forEach(d => {
                        context.beginPath();
                        context.fillStyle = is_multiple ? myColors[getRandomMultinomial(stateValues)] : "black";
                        context.fillRect(d[0], d[1], 2, 2);
                    });

                }
                context.restore()
            });

            function getRandomMultinomial(odds) {
                const total_odds = d3v5.sum(odds)
                let probs = odds.map(d => d / total_odds)
                const rand = Math.random();
                let cumulative_prob = 0;
                for (let i = 0; i < probs.length; i++) {
                    cumulative_prob += probs[i];
                    if (rand <= cumulative_prob) {
                        return i;
                    }
                }
            }
        });


    function createPoints(width, height, radius) {
        var sample = poissonDiscSampler(width, height, radius);
        for (var data = [], d; d = sample();) {
            data.push(d);
        }
        return data;
    }

    function poissonDiscSampler(width, height, radius) {
        var k = 30,
            radius2 = radius * radius,
            R = 3 * radius2,
            cellSize = radius * Math.SQRT1_2,
            gridWidth = Math.ceil(width / cellSize),
            gridHeight = Math.ceil(height / cellSize),
            grid = new Array(gridWidth * gridHeight),
            queue = [],
            queueSize = 0,
            sampleSize = 0;

        return function () {
            if (!sampleSize) return sample(Math.random() * width, Math.random() * height);

            while (queueSize) {
                var i = Math.random() * queueSize | 0,
                    s = queue[i];

                for (var j = 0; j < k; ++j) {
                    var a = 2 * Math.PI * Math.random(),
                        r = Math.sqrt(Math.random() * R + radius2),
                        x = s[0] + r * Math.cos(a),
                        y = s[1] + r * Math.sin(a);

                    if (0 <= x && x < width && 0 <= y && y < height && far(x, y)) return sample(x, y);
                }

                queue[i] = queue[--queueSize];
                queue.length = queueSize;
            }
        };

        function far(x, y) {
            var i = x / cellSize | 0,
                j = y / cellSize | 0,
                i0 = Math.max(i - 2, 0),
                j0 = Math.max(j - 2, 0),
                i1 = Math.min(i + 3, gridWidth),
                j1 = Math.min(j + 3, gridHeight);

            for (j = j0; j < j1; ++j) {
                var o = j * gridWidth;
                for (i = i0; i < i1; ++i) {
                    if (s = grid[o + i]) {
                        var s,
                            dx = s[0] - x,
                            dy = s[1] - y;
                        if (dx * dx + dy * dy < radius2) return false;
                    }
                }
            }

            return true;
        }

        function sample(x, y) {
            var s = [x, y];
            queue.push(s);
            grid[gridWidth * (y / cellSize | 0) + (x / cellSize | 0)] = s;
            ++sampleSize;
            ++queueSize;
            return s;
        }
    }
}

dot_plot(false, "#map_dot");
dot_plot(true, "#map_dot_multiple");
