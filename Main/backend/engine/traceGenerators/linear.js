/**
 * Trace generators for linear data structures:
 * Linked List, Stack, Queue
 */

// ── Linked List ──────────────────────────────────────────────────────────────
function linkedListTrace(initialValues = [1, 2, 3, 4, 5], insertValue = 99, insertAfter = 3) {
  const trace = [];
  let step = 1;

  // Build initial list representation
  function buildList(values) {
    return values.map((val, i) => ({
      val,
      id: i,
      next: i < values.length - 1 ? i + 1 : null,
    }));
  }

  let nodes = buildList(initialValues);

  trace.push({
    step: step++,
    line: 1,
    action: 'init',
    highlight: [1],
    state: { nodes: JSON.parse(JSON.stringify(nodes)), head: 0, currentNode: null },
  });

  // Traverse to find insert point
  let current = 0;
  while (current !== null) {
    trace.push({
      step: step++,
      line: 3,
      action: 'traverse',
      highlight: [3],
      state: {
        nodes: JSON.parse(JSON.stringify(nodes)),
        head: 0,
        currentNode: current,
        target: insertAfter,
      },
    });

    if (nodes[current].val === insertAfter) {
      // Insert new node
      const newId = nodes.length;
      const oldNext = nodes[current].next;
      const newNode = { val: insertValue, id: newId, next: oldNext };
      nodes.push(newNode);
      nodes[current].next = newId;

      trace.push({
        step: step++,
        line: 5,
        action: 'insert',
        highlight: [5, 6, 7],
        state: {
          nodes: JSON.parse(JSON.stringify(nodes)),
          head: 0,
          currentNode: current,
          insertedNode: newId,
          insertAfterNode: current,
        },
      });
      break;
    }
    current = nodes[current].next;
  }

  trace.push({
    step: step++,
    line: 9,
    action: 'done',
    highlight: [],
    state: { nodes: JSON.parse(JSON.stringify(nodes)), head: 0, currentNode: null },
  });

  return trace;
}

// ── Stack Operations ─────────────────────────────────────────────────────────
function stackOpsTrace() {
  const trace = [];
  let step = 1;
  let stack = [];

  const operations = [
    { op: 'push', val: 10 },
    { op: 'push', val: 20 },
    { op: 'push', val: 30 },
    { op: 'peek' },
    { op: 'pop' },
    { op: 'push', val: 40 },
    { op: 'pop' },
    { op: 'pop' },
  ];

  trace.push({
    step: step++,
    line: 1,
    action: 'init',
    highlight: [1],
    state: { stack: [...stack], operation: null, value: null },
  });

  for (const { op, val } of operations) {
    if (op === 'push') {
      stack.push(val);
      trace.push({
        step: step++,
        line: 3,
        action: 'push',
        highlight: [3, 4],
        state: { stack: [...stack], operation: 'push', value: val, top: stack.length - 1 },
      });
    } else if (op === 'pop') {
      if (stack.length === 0) {
        trace.push({
          step: step++,
          line: 7,
          action: 'underflow',
          highlight: [7],
          state: { stack: [...stack], operation: 'pop', value: null, error: 'Stack underflow' },
        });
      } else {
        const popped = stack.pop();
        trace.push({
          step: step++,
          line: 6,
          action: 'pop',
          highlight: [6, 7],
          state: { stack: [...stack], operation: 'pop', value: popped, top: stack.length - 1 },
        });
      }
    } else if (op === 'peek') {
      trace.push({
        step: step++,
        line: 9,
        action: 'peek',
        highlight: [9],
        state: {
          stack: [...stack],
          operation: 'peek',
          value: stack[stack.length - 1],
          top: stack.length - 1,
        },
      });
    }
  }

  trace.push({
    step: step++,
    line: 11,
    action: 'done',
    highlight: [],
    state: { stack: [...stack], operation: null, value: null },
  });

  return trace;
}

// ── Queue Operations ─────────────────────────────────────────────────────────
function queueOpsTrace() {
  const trace = [];
  let step = 1;
  let queue = [];

  const operations = [
    { op: 'enqueue', val: 'A' },
    { op: 'enqueue', val: 'B' },
    { op: 'enqueue', val: 'C' },
    { op: 'dequeue' },
    { op: 'enqueue', val: 'D' },
    { op: 'dequeue' },
    { op: 'dequeue' },
  ];

  trace.push({
    step: step++,
    line: 1,
    action: 'init',
    highlight: [1],
    state: { queue: [...queue], operation: null, value: null, front: 0, rear: -1 },
  });

  for (const { op, val } of operations) {
    if (op === 'enqueue') {
      queue.push(val);
      trace.push({
        step: step++,
        line: 3,
        action: 'enqueue',
        highlight: [3, 4],
        state: {
          queue: [...queue],
          operation: 'enqueue',
          value: val,
          front: 0,
          rear: queue.length - 1,
        },
      });
    } else if (op === 'dequeue') {
      if (queue.length === 0) {
        trace.push({
          step: step++,
          line: 7,
          action: 'underflow',
          highlight: [7],
          state: { queue: [...queue], operation: 'dequeue', value: null, error: 'Queue is empty' },
        });
      } else {
        const dequeued = queue.shift();
        trace.push({
          step: step++,
          line: 6,
          action: 'dequeue',
          highlight: [6, 7],
          state: {
            queue: [...queue],
            operation: 'dequeue',
            value: dequeued,
            front: 0,
            rear: queue.length - 1,
          },
        });
      }
    }
  }

  trace.push({
    step: step++,
    line: 9,
    action: 'done',
    highlight: [],
    state: { queue: [...queue], operation: null, value: null },
  });

  return trace;
}

module.exports = { linkedListTrace, stackOpsTrace, queueOpsTrace };
