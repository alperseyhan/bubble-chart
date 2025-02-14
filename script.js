import * as d3 from 'd3';

class BubbleChart {
    constructor() {
        this.datasets = {
            dataset1: [
                { id: 1, name: "E", value: 14, category: "Best" },
                { id: 2, name: "S", value: 6, category: "Best" },
                { id: 3, name: "G", value: 6, category: "Best" },
                { id: 4, name: "E", value: 7, category: "Worst" },
                { id: 5, name: "S", value: 1, category: "Worst" },
                { id: 6, name: "G", value: 18, category: "Worst" }
            ],
            dataset2: [
                { id: 1, name: "MAI-G1", value: 13, category: "Worst" },
                { id: 2, name: "FP-G2", value: 6, category: "Best" },
                { id: 3, name: "ER-G3", value: 5, category: "Best" },
                { id: 4, name: "ECP-G4", value: 9, category: "Best" },
                { id: 5, name: "TD-G5", value: 4, category: "Best" },
                { id: 6, name: "RMEP-G6", value: 2, category: "Best" },
                { id: 7, name: "FP-G2", value: 4, category: "Worst" },
                { id: 8, name: "ER-G3", value: 5, category: "Worst" },
                { id: 9, name: "ECP-G4", value: 1, category: "Worst" },
                { id: 10, name: "TD-G5", value: 5, category: "Worst" },
                { id: 11, name: "DPCS-G7", value: 3, category: "Worst" }
            ],
            dataset3: [
                { id: 1, name: "ERS-S1", value: 7, category: "Best" },
                { id: 2, name: "TD-S2", value: 5, category: "Best" },
                { id: 3, name: "CR-S6", value: 5, category: "Best" },
                { id: 4, name: "HREF-S7", value: 9, category: "Best" },
                { id: 5, name: "DI-S4", value: 5, category: "Worst" },
                { id: 6, name: "SMA-S5", value: 21, category: "Worst" }
            ]
        };
        
        this.init();
    }

    init() {
        // Global olarak erişilebilir yap
        window.chartApp = {
            showChart: this.showChart.bind(this)
        };
        
        // İlk veri setini göster
        this.showChart('dataset1');
    }

    showChart(datasetKey) {
        // Önceki çizimi temizle
        d3.select("#chart").html("");

        const width = 600;
        const height = 400;

        // SVG oluştur
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Bubble chart için scale oluştur
        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(this.datasets[datasetKey], d => d.value)])
            .range([10, 50]);

        // Renk skalasını güncelle - Best için yeşil, Worst için kırmızı
        const colorScale = d3.scaleOrdinal()
            .domain(["Best", "Worst"])
            .range(["#2ecc71", "#e74c3c"]);

        // Simulation oluştur
        const simulation = d3.forceSimulation(this.datasets[datasetKey])
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2).strength(0.05))
            .force("collide", d3.forceCollide(d => radiusScale(d.value) + 2));

        // Bubbles çiz
        const circles = svg.selectAll("circle")
            .data(this.datasets[datasetKey])
            .enter()
            .append("circle")
            .attr("r", d => radiusScale(d.value))
            .attr("fill", d => colorScale(d.category))
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        // Etiketleri ekle
        const labels = svg.selectAll("text")
            .data(this.datasets[datasetKey])
            .enter()
            .append("text")
            .text(d => `${d.name}(${d.value})`)  // Değeri de göster
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px");

        // Simulation güncelleme
        simulation.on("tick", () => {
            circles
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);

            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
    }
}

// Sayfa yüklendiğinde başlat
new BubbleChart(); 