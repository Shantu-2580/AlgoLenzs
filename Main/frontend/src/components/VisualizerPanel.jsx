import { useEffect, useRef } from 'react'
import AlgorithmBadge from './AlgorithmBadge'
import renderSorting from '../visualizers/SortingVisualizer'
import renderTree from '../visualizers/TreeVisualizer'
import renderGraph from '../visualizers/GraphVisualizer'
import renderList from '../visualizers/ListVisualizer'

function renderByCategory(svgEl, category, step) {
  const normalized = String(category || '').toLowerCase().replace(/\s+/g, '')

  switch (normalized) {
    case 'Sorting':
    case 'sorting':
      renderSorting(svgEl, step)
      break
    case 'Trees':
    case 'tree':
    case 'trees':
      renderTree(svgEl, step)
      break
    case 'Graphs':
    case 'graph':
    case 'graphs':
      renderGraph(svgEl, step)
      break
    case 'linkedlist':
    case 'linked-list':
    case 'linked list':
    case 'stack':
    case 'queue':
    case 'stack/queue':
    case 'stack/ queue':
    case 'stack /queue':
    case 'stack / queue':
      renderList(svgEl, step, category)
      break
    default:
      renderSorting(svgEl, step)
  }
}

export default function VisualizerPanel({ result, stepData, hasTrace }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!hasTrace || !svgRef.current) return
    renderByCategory(svgRef.current, result?.category, stepData)
  }, [hasTrace, result?.category, stepData])

  return (
    <section className="glass-card flex min-h-0 flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <AlgorithmBadge
          algorithm={result?.algorithm}
          category={result?.category}
          confidence={result?.confidence}
        />
      </div>

      <div className="relative flex h-[260px] sm:h-[320px] md:h-[380px] lg:h-[430px] items-center justify-center overflow-hidden rounded-lg border border-neon-border bg-editor">
        {hasTrace ? (
          <svg ref={svgRef} className="h-full w-full" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="wave-grid" aria-hidden="true" />
            <p className="text-sm text-text-muted">Paste code on the left to begin</p>
          </div>
        )}
      </div>
    </section>
  )
}
