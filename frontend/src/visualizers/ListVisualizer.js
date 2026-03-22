import * as d3 from 'd3'

const DEFAULT_VALUES = ['12', '7', '19', '31']

export default function renderList(svgEl, step, category) {
  if (!svgEl) return

  const values =
    step?.values ??
    step?.array ??
    step?.state?.values ??
    step?.state?.array ??
    DEFAULT_VALUES

  const activeIndex = step?.index ?? step?.pointer ?? step?.state?.index ?? 0

  const width = svgEl.clientWidth || 700
  const height = svgEl.clientHeight || 340

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('viewBox', `0 0 ${width} ${height}`)

  const nodeWidth = Math.max(80, Math.min(130, (width - 80) / Math.max(values.length, 1)))
  const y = height / 2 - 28

  const groups = svg
    .selectAll('g.node')
    .data(values)
    .join('g')
    .attr('transform', (_, i) => `translate(${40 + i * (nodeWidth + 20)}, ${y})`)

  groups
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', 56)
    .attr('rx', 12)
    .attr('fill', (_, i) => (i === activeIndex ? '#00f5c4' : '#151526'))
    .attr('stroke', '#7c6af7')
    .attr('stroke-width', 2)

  groups
    .append('text')
    .attr('x', nodeWidth / 2)
    .attr('y', 33)
    .attr('text-anchor', 'middle')
    .attr('fill', '#e8e8f0')
    .attr('font-size', 13)
    .attr('font-family', 'JetBrains Mono, monospace')
    .text((d) => d)

  svg
    .selectAll('line.link')
    .data(values.slice(0, -1))
    .join('line')
    .attr('x1', (_, i) => 40 + i * (nodeWidth + 20) + nodeWidth)
    .attr('x2', (_, i) => 40 + i * (nodeWidth + 20) + nodeWidth + 18)
    .attr('y1', height / 2)
    .attr('y2', height / 2)
    .attr('stroke', '#5b5f92')
    .attr('stroke-width', 2)

  const pointerLabel = category === 'Stack / Queue' ? 'TOP/FRONT' : 'PTR'

  svg
    .append('text')
    .attr('x', 40 + activeIndex * (nodeWidth + 20) + nodeWidth / 2)
    .attr('y', y - 12)
    .attr('text-anchor', 'middle')
    .attr('fill', '#00f5c4')
    .attr('font-size', 12)
    .attr('font-family', 'Space Mono, monospace')
    .text(pointerLabel)
}
