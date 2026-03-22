import * as d3 from 'd3'

const DEFAULT_NODES = [
  { id: 'A', x: 160, y: 160 },
  { id: 'B', x: 300, y: 80 },
  { id: 'C', x: 450, y: 130 },
  { id: 'D', x: 380, y: 260 },
  { id: 'E', x: 220, y: 280 },
]

const DEFAULT_LINKS = [
  { source: 'A', target: 'B' },
  { source: 'B', target: 'C' },
  { source: 'C', target: 'D' },
  { source: 'D', target: 'E' },
  { source: 'E', target: 'A' },
  { source: 'A', target: 'D' },
]

export default function renderGraph(svgEl, step) {
  if (!svgEl) return

  const nodes = step?.nodes ?? step?.state?.nodes ?? DEFAULT_NODES
  const links = step?.links ?? step?.state?.links ?? DEFAULT_LINKS
  const active = new Set(step?.visited ?? step?.path ?? step?.state?.visited ?? [])

  const width = svgEl.clientWidth || 700
  const height = svgEl.clientHeight || 340

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('viewBox', `0 0 ${width} ${height}`)

  const idToNode = new Map(nodes.map((node) => [node.id, node]))

  svg
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('x1', (d) => idToNode.get(d.source)?.x ?? 0)
    .attr('y1', (d) => idToNode.get(d.source)?.y ?? 0)
    .attr('x2', (d) => idToNode.get(d.target)?.x ?? 0)
    .attr('y2', (d) => idToNode.get(d.target)?.y ?? 0)
    .attr('stroke', '#3a3d60')
    .attr('stroke-width', 2)

  const groups = svg
    .selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  groups
    .append('circle')
    .attr('r', 16)
    .attr('fill', (d) => (active.has(d.id) ? '#00f5c4' : '#171828'))
    .attr('stroke', '#7c6af7')
    .attr('stroke-width', 2)

  groups
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', '#e8e8f0')
    .attr('font-size', 12)
    .attr('font-family', 'JetBrains Mono, monospace')
    .text((d) => d.id)

  if (active.size > 0) {
    const first = nodes.find((node) => active.has(node.id))
    if (first) {
      svg
        .append('circle')
        .attr('cx', first.x)
        .attr('cy', first.y)
        .attr('r', 24)
        .attr('stroke', '#00f5c4')
        .attr('stroke-width', 2)
        .attr('fill', 'none')
        .attr('opacity', 0.7)
    }
  }
}
