import * as d3 from 'd3';

// Veriyi hazırla - bubble chart formatında
const data = {
  name: "Root",
  children: [
    // Best değerleri
    { name: 'Best', group: 'CE-E1', value: 7 },
    { name: 'Best', group: 'FUE-E2', value: 7 },
    { name: 'Best', group: 'EC-E3', value: 1 },
    { name: 'Best', group: 'WPWM-E4', value: 3 },
    { name: 'Best', group: 'MBEM-E6', value: 4 },
    { name: 'Best', group: 'ECR-E7', value: 4 },
    // Worst değerleri
    { name: 'Worst', group: 'CE-E1', value: 1 },
    { name: 'Worst', group: 'NPC-E5', value: 25 }
  ]
};

// Grafik boyutları
const width = 1000;
const height = 700;

// Renk skalası - sadece Best/Worst durumuna göre
const color = d3.scaleOrdinal()
  .domain(['Best', 'Worst'])
  .range([
    '#2ECC71', // Best için canlı yeşil
    '#E74C3C'  // Worst için canlı kırmızı
  ]);

// Pack layout oluştur
const pack = data => d3.pack()
  .size([width, height])
  .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value));

// SVG oluştur
const svg = d3.select('.chart-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [0, 0, width, height])
  .attr('font-family', 'sans-serif')
  .attr('text-anchor', 'middle');

const root = pack(data);

const leaf = svg.selectAll('g')
  .data(root.leaves())
  .join('g')
    .attr('transform', d => `translate(${d.x},${d.y})`);

leaf.append('circle')
  .attr('fill', d => color(d.data.name)) // name'e göre renk (Best/Worst)
  .attr('r', d => d.r)
  .attr('opacity', 0.8) // Tüm balonlar için sabit opaklık
  .append('title')
  .text(d => `${d.data.name}\n${d.data.group}: ${d.data.value}`);

leaf.append('text')
  .attr('clip-path', d => `circle(${d.r}px)`)
  .attr('fill', 'white')
  .attr('font-weight', 'bold')
  .attr('font-size', '16px')
  .attr('dominant-baseline', 'middle')
  .attr('text-anchor', 'middle')
  .selectAll('tspan')
  .data(d => [`${d.data.group}`])
  .join('tspan')
    .attr('x', 0)
    .attr('y', 0)
    .text(d => d);

// Lejantı güncelle - hizalama ve boşlukları düzelt
const legend = svg.append('g')
  .attr('transform', `translate(${width - 180},${height - 120})`);

legend.selectAll('rect')
  .data(color.domain())
  .join('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 49) // Best ve Worst kutuları arası boşluk
    .attr('width', 25)
    .attr('height', 25)
    .attr('fill', color);

legend.selectAll('text')
  .data(color.domain())
  .join('text')
    .attr('x', 45)
    .attr('y', (d, i) => i * 49 + 18) // Text'leri kutularla aynı aralığa getir
    .attr('font-size', '16px')
    .attr('alignment-baseline', 'middle') // Dikey hizalama için
    .text(d => d);
