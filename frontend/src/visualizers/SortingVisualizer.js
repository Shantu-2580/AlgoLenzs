import * as d3 from 'd3'

const DEFAULT_VALUES = [24, 16, 42, 8, 36, 31, 12, 29]

export default function renderSorting(svgEl, step) {
  if (!svgEl) return

  const values =
    step?.array ??
    step?.values ??
    step?.state?.array ??
    step?.state?.values ??
    DEFAULT_VALUES

  const compare = step?.compare ?? step?.indices?.compare ?? []
  const swap = step?.swap ?? step?.indices?.swap ?? []
  const sortedUntil = step?.sortedUntil ?? step?.state?.sortedUntil

  const width = svgEl.clientWidth || 700
  const height = svgEl.clientHeight || 340

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('viewBox', `0 0 ${width} ${height}`)

  const x = d3
    .scaleBand()
    .domain(values.map((_, idx) => idx))
    .range([20, width - 20])
    .padding(0.16)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(values) || 1])
    .range([height - 24, 20])

  svg
    .selectAll('rect')
    .data(values)
    .join('rect')
    .attr('x', (_, i) => x(i))
    .attr('width', x.bandwidth())
    .attr('y', (d) => y(d))
    .attr('height', (d) => height - 24 - y(d))
    .attr('rx', 6)
    .attr('fill', (_, i) => {
      if (swap.includes(i)) return '#ff4f6d'
      if (compare.includes(i)) return '#facc15'
      if (typeof sortedUntil === 'number' && i <= sortedUntil) return '#00f5c4'
      return '#7c6af7'
    })
    .attr('filter', 'url(#barGlow)')

  svg
    .selectAll('text')
    .data(values)
    .join('text')
    .attr('x', (_, i) => (x(i) || 0) + x.bandwidth() / 2)
    .attr('y', (d) => y(d) - 8)
    .attr('text-anchor', 'middle')
    .attr('fill', '#e8e8f0')
    .attr('font-size', 12)
    .attr('font-family', 'JetBrains Mono, monospace')
    .text((d) => d)

  const defs = svg.append('defs')
  const filter = defs.append('filter').attr('id', 'barGlow')
  filter
    .append('feDropShadow')
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 4)
    .attr('flood-color', '#00f5c4')
    .attr('flood-opacity', 0.28)
}
