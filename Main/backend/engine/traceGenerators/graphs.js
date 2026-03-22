/**
 * Trace generators for graph algorithms (BFS and DFS).
 * Uses an adjacency list representation.
 * Default: 6-node sample graph
 */

const SAMPLE_GRAPH = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4],
};

// ── BFS ──────────────────────────────────────────────────────────────────────
function bfsTrace(graph = SAMPLE_GRAPH, startNode = 0) {
  const trace = [];
  let step = 1;
  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1, 2],
    state: {
      graph,
      queue: [...queue],
      visited: [...visited],
      currentNode: null,
    },
  });

  while (queue.length > 0) {
    const node = queue.shift();

    trace.push({
      step: step++,
      line: 4,
      action: 'dequeue',
      highlight: [4],
      state: {
        graph,
        queue: [...queue],
        visited: [...visited],
        currentNode: node,
      },
    });

    trace.push({
      step: step++,
      line: 5,
      action: 'visit',
      highlight: [5],
      state: {
        graph,
        queue: [...queue],
        visited: [...visited],
        currentNode: node,
      },
    });

    for (const neighbor of (graph[node] || [])) {
      trace.push({
        step: step++,
        line: 7,
        action: 'check_neighbor',
        highlight: [7],
        state: {
          graph,
          queue: [...queue],
          visited: [...visited],
          currentNode: node,
          checkingNeighbor: neighbor,
        },
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        trace.push({
          step: step++,
          line: 9,
          action: 'enqueue',
          highlight: [9, 10],
          state: {
            graph,
            queue: [...queue],
            visited: [...visited],
            currentNode: node,
            enqueuedNode: neighbor,
            from: node,
          },
        });
      }
    }
  }

  trace.push({
    step: step++,
    line: 12,
    action: 'done',
    highlight: [],
    state: {
      graph,
      queue: [],
      visited: [...visited],
      currentNode: null,
    },
  });

  return trace;
}

// ── DFS ──────────────────────────────────────────────────────────────────────
function dfsTrace(graph = SAMPLE_GRAPH, startNode = 0) {
  const trace = [];
  let step = 1;
  const visited = new Set();

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1],
    state: { graph, visited: [...visited], currentNode: null, callStack: [startNode] },
  });

  function dfs(node, callStack) {
    visited.add(node);

    trace.push({
      step: step++,
      line: 3,
      action: 'visit',
      highlight: [3],
      state: { graph, visited: [...visited], currentNode: node, callStack: [...callStack] },
    });

    for (const neighbor of (graph[node] || [])) {
      trace.push({
        step: step++,
        line: 5,
        action: 'check_neighbor',
        highlight: [5],
        state: {
          graph,
          visited: [...visited],
          currentNode: node,
          checkingNeighbor: neighbor,
          callStack: [...callStack],
        },
      });

      if (!visited.has(neighbor)) {
        trace.push({
          step: step++,
          line: 6,
          action: 'recurse',
          highlight: [6],
          state: {
            graph,
            visited: [...visited],
            currentNode: node,
            nextNode: neighbor,
            callStack: [...callStack, neighbor],
          },
        });
        dfs(neighbor, [...callStack, neighbor]);
      }
    }

    trace.push({
      step: step++,
      line: 8,
      action: 'backtrack',
      highlight: [8],
      state: {
        graph,
        visited: [...visited],
        currentNode: node,
        callStack: callStack.slice(0, -1),
      },
    });
  }

  dfs(startNode, [startNode]);

  trace.push({
    step: step++,
    line: 9,
    action: 'done',
    highlight: [],
    state: { graph, visited: [...visited], currentNode: null, callStack: [] },
  });

  return trace;
}

module.exports = { bfsTrace, dfsTrace };
