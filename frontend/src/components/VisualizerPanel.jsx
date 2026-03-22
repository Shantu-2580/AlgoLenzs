import { useEffect, useRef } from 'react'
import AlgorithmBadge from './AlgorithmBadge'
import renderSorting from '../visualizers/SortingVisualizer'
import renderTree from '../visualizers/TreeVisualizer'
import renderGraph from '../visualizers/GraphVisualizer'
import renderList from '../visualizers/ListVisualizer'

function renderByCategory(svgEl, category, step) {
  switch (category) {
    case 'Sorting':
      renderSorting(svgEl, step)
      break
    case 'Trees':
      renderTree(svgEl, step)
      break
    case 'Graphs':
      renderGraph(svgEl, step)
      break
    case 'Linked List':
    case 'Stack / Queue':
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
    <section className="glass-card flex h-full flex-col p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <AlgorithmBadge
          algorithm={result?.algorithm}
          category={result?.category}
          confidence={result?.confidence}
        />
      </div>

      <div className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-hidden rounded-lg border border-neon-border bg-editor">
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
