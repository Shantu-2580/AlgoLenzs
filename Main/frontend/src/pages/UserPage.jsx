import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import CodeEditor from '../components/CodeEditor'
import VisualizerPanel from '../components/VisualizerPanel'
import StepControls from '../components/StepControls'
import ToastHost from '../components/ToastHost'
import useVisualizer from '../hooks/useVisualizer'
import { recognizeCode } from '../utils/api'

const algorithmFallback = {
  bubble_sort: { category: 'Sorting', description: 'Repeatedly compares adjacent elements and swaps if out of order.', time: 'O(n^2)', space: 'O(1)' },
  selection_sort: { category: 'Sorting', description: 'Selects the minimum element and places it in sorted order.', time: 'O(n^2)', space: 'O(1)' },
  insertion_sort: { category: 'Sorting', description: 'Builds a sorted array by inserting each element into place.', time: 'O(n^2)', space: 'O(1)' },
  merge_sort: { category: 'Sorting', description: 'Divide-and-conquer sorting that recursively merges sorted halves.', time: 'O(n log n)', space: 'O(n)' },
  quick_sort: { category: 'Sorting', description: 'Partitions around a pivot and recursively sorts partitions.', time: 'O(n log n)', space: 'O(log n)' },
  bst_insert: { category: 'Trees', description: 'Inserts a new value in a binary search tree by following ordering.', time: 'O(h)', space: 'O(1)' },
  bst_search: { category: 'Trees', description: 'Searches the BST by taking left or right path at each node.', time: 'O(h)', space: 'O(1)' },
  tree_inorder: { category: 'Trees', description: 'Visits left subtree, root, then right subtree.', time: 'O(n)', space: 'O(h)' },
  tree_preorder: { category: 'Trees', description: 'Visits root, then left subtree, then right subtree.', time: 'O(n)', space: 'O(h)' },
  tree_postorder: { category: 'Trees', description: 'Visits left subtree, right subtree, and finally root.', time: 'O(n)', space: 'O(h)' },
  bfs: { category: 'Graphs', description: 'Traverses graph level by level from source node.', time: 'O(V + E)', space: 'O(V)' },
  dfs: { category: 'Graphs', description: 'Explores deep along a path before backtracking.', time: 'O(V + E)', space: 'O(V)' },
  ll_insert: { category: 'Linked List', description: 'Adds a node at a target position by pointer rewiring.', time: 'O(n)', space: 'O(1)' },
  ll_delete: { category: 'Linked List', description: 'Removes a node and reconnects neighboring pointers.', time: 'O(n)', space: 'O(1)' },
  ll_traverse: { category: 'Linked List', description: 'Moves through each node one-by-one from head.', time: 'O(n)', space: 'O(1)' },
  stack_ops: { category: 'Stack / Queue', description: 'Performs LIFO push/pop operations at stack top.', time: 'O(1)', space: 'O(n)' },
  queue_ops: { category: 'Stack / Queue', description: 'Performs FIFO enqueue/dequeue across queue ends.', time: 'O(1)', space: 'O(n)' },
}

export default function UserPage() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('auto')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  const [editorVisible, setEditorVisible] = useState(true)
  const [expandedInfo, setExpandedInfo] = useState(false)

  const {
    currentStep,
    isPlaying,
    speed,
    totalSteps,
    stepData,
    setSpeed,
    reset,
    prev,
    next,
    togglePlay,
  } = useVisualizer(result?.trace ?? [])

  const resolvedInfo = useMemo(() => {
    if (!result?.algorithm) return null
    const fallback = algorithmFallback[result.algorithm] ?? {
      category: result.category ?? 'Unknown',
      description: 'No description available',
      time: result?.complexity?.time ?? 'N/A',
      space: result?.complexity?.space ?? 'N/A',
    }

    return {
      description: result.description ?? fallback.description,
      time: result?.complexity?.time ?? fallback.time,
      space: result?.complexity?.space ?? fallback.space,
    }
  }, [result])

  const pushToast = (message) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 4200)
  }

  const onVisualize = async () => {
    if (!code.trim()) {
      pushToast('Paste code first before running visualization.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await recognizeCode({ code, language })
      if (!data?.algorithm) {
        setError('Algorithm not recognized')
        pushToast('Algorithm not recognized')
        return
      }
      reset()
      setResult(data)
    } catch {
      setError('Algorithm not recognized')
      pushToast('Failed to analyze code. Check API or try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg-main pb-24 md:pb-8">
      <Navbar onToggleEditor={() => setEditorVisible((prev) => !prev)} editorVisible={editorVisible} />

      <section className="hero-grid mx-auto max-w-7xl px-4 pb-6 pt-4 md:px-6 md:pt-6">
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-[45%_55%]">
          <div className={`${editorVisible ? 'block' : 'hidden sm:block'} min-h-0`}>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              onVisualize={onVisualize}
              isLoading={isLoading}
              error={error}
            />
          </div>

          <div className="min-h-0">
            <VisualizerPanel result={result} stepData={stepData} hasTrace={Boolean(result?.trace?.length)} />

            <div className="md:static md:mt-0 fixed bottom-0 left-0 right-0 z-40 bg-bg-main/85 px-2 pb-2 pt-2 backdrop-blur sm:px-4 md:bg-transparent md:px-0 md:pb-0">
              <StepControls
                currentStep={currentStep}
                totalSteps={totalSteps}
                isPlaying={isPlaying}
                speed={speed}
                onReset={reset}
                onPrev={prev}
                onTogglePlay={togglePlay}
                onNext={next}
                onSpeedChange={setSpeed}
              />
            </div>

            <article className="glass-card mt-3 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => setExpandedInfo((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <h3 className="font-display text-lg text-text-main">
                    {result?.algorithm ? result.algorithm.replaceAll('_', ' ').toUpperCase() : 'Algorithm Info'}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{resolvedInfo?.description ?? 'Run visualization to see complexity details.'}</p>
                </div>
                <span className="text-sm text-neon-mint">{expandedInfo ? 'Hide' : 'Expand'}</span>
              </button>

              {expandedInfo ? (
                <div className="mt-3 grid gap-3 border-t border-neon-border pt-3 text-sm sm:grid-cols-2">
                  <p className="rounded-md border border-neon-border bg-surface/80 px-3 py-2 text-text-main">
                    Time Complexity: <span className="font-code text-neon-mint">{resolvedInfo?.time ?? 'N/A'}</span>
                  </p>
                  <p className="rounded-md border border-neon-border bg-surface/80 px-3 py-2 text-text-main">
                    Space Complexity: <span className="font-code text-neon-purple">{resolvedInfo?.space ?? 'N/A'}</span>
                  </p>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      <ToastHost toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))} />
    </main>
  )
}
