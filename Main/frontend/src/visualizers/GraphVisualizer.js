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

function graphStateToNodesLinks(graph, width, height) {
  if (!graph || typeof graph !== 'object') {
    return { nodes: [], links: [] }
  }

  const nodeIds = Object.keys(graph)
  if (!nodeIds.length) {
    return { nodes: [], links: [] }
  }

  const radius = Math.min(width, height) * 0.34
  const cx = width / 2
  const cy = height / 2

  const nodes = nodeIds.map((id, idx) => {
    const angle = (2 * Math.PI * idx) / nodeIds.length
    return {
      id: String(id),
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  })

  const seen = new Set()
  const links = []
  for (const [source, neighbors] of Object.entries(graph)) {
    const values = Array.isArray(neighbors)
      ? neighbors
      : String(neighbors || '')
          .split(/\s+/)
          .filter(Boolean)

    values.forEach((targetRaw) => {
      const target = String(targetRaw)
      const key = [String(source), target].sort().join('::')
      if (!seen.has(key)) {
        seen.add(key)
        links.push({ source: String(source), target })
      }
    })
  }

  return { nodes, links }
}

export default function renderGraph(svgEl, step) {
  if (!svgEl) return

  const width = svgEl.clientWidth || 700
  const height = svgEl.clientHeight || 340
  const derived = graphStateToNodesLinks(step?.state?.graph, width, height)

  const nodes = step?.nodes ?? step?.state?.nodes ?? (derived.nodes.length ? derived.nodes : DEFAULT_NODES)
  const links = step?.links ?? step?.state?.links ?? (derived.links.length ? derived.links : DEFAULT_LINKS)
  const activeSet = new Set(step?.visited ?? step?.path ?? step?.state?.visited ?? [])
  if (step?.state?.currentNode !== null && step?.state?.currentNode !== undefined) {
    activeSet.add(step.state.currentNode)
  }
  if (step?.state?.checkingNeighbor !== null && step?.state?.checkingNeighbor !== undefined) {
    activeSet.add(step.state.checkingNeighbor)
  }
  const active = new Set(Array.from(activeSet).map((v) => String(v)))

  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()
  svg.attr('viewBox', `0 0 ${width} ${height}`)

  const idToNode = new Map(nodes.map((node) => [String(node.id), node]))

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
