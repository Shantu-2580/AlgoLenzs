import * as d3 from 'd3'

const DEFAULT_NODES = [
  { id: '20', x: 360, y: 70 },
  { id: '10', x: 240, y: 150 },
  { id: '30', x: 480, y: 150 },
  { id: '7', x: 180, y: 230 },
  { id: '14', x: 300, y: 230 },
  { id: '26', x: 420, y: 230 },
  { id: '36', x: 540, y: 230 },
]

const DEFAULT_LINKS = [
  { source: '20', target: '10' },
  { source: '20', target: '30' },
  { source: '10', target: '7' },
  { source: '10', target: '14' },
  { source: '30', target: '26' },
  { source: '30', target: '36' },
]

export default function renderTree(svgEl, step) {
  if (!svgEl) return

  const nodes = step?.nodes ?? step?.state?.nodes ?? DEFAULT_NODES
  const links = step?.links ?? step?.state?.links ?? DEFAULT_LINKS
  const active = new Set(step?.path ?? step?.visited ?? step?.state?.path ?? [])

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
    .attr('stroke', '#2f3250')
    .attr('stroke-width', 2)

  const groups = svg
    .selectAll('g.node')
    .data(nodes)
    .join('g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)

  groups
    .append('circle')
    .attr('r', 20)
    .attr('fill', (d) => (active.has(d.id) ? '#00f5c4' : '#111118'))
    .attr('stroke', (d) => (active.has(d.id) ? '#00f5c4' : '#7c6af7'))
    .attr('stroke-width', 2.5)

  groups
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('fill', '#e8e8f0')
    .attr('font-size', 13)
    .attr('font-family', 'JetBrains Mono, monospace')
    .text((d) => d.id)
}
