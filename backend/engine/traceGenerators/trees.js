/**
 * Trace generators for tree algorithms.
 * Uses a simple object tree structure: { val, left, right }
 */

// ── Tree helpers ─────────────────────────────────────────────────────────────

function buildTree(values) {
  if (!values.length) return null;
  let root = null;

  function insert(node, val) {
    if (!node) return { val, left: null, right: null, id: val };
    if (val < node.val) node.left  = insert(node.left,  val);
    else                node.right = insert(node.right, val);
    return node;
  }

  for (const v of values) {
    root = insert(root, v);
  }
  return root;
}

function cloneTree(node) {
  if (!node) return null;
  return { val: node.val, id: node.id, left: cloneTree(node.left), right: cloneTree(node.right) };
}

// ── BST Insert ───────────────────────────────────────────────────────────────
function bstInsertTrace(insertValues = [5, 3, 7, 1, 4], newValue = 6) {
  const trace = [];
  let step = 1;
  const tree = buildTree(insertValues);

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1],
    state: { tree: cloneTree(tree), value: newValue, currentNode: null, path: [] },
  });

  const path = [];

  function insertWithTrace(node, val) {
    if (!node) {
      const newNode = { val, id: val, left: null, right: null };
      trace.push({
        step: step++,
        line: 6,
        action: 'insert',
        highlight: [6, 7],
        state: { tree: cloneTree(tree), value: val, insertAt: path[path.length - 1] || null, path: [...path] },
      });
      return newNode;
    }

    trace.push({
      step: step++,
      line: 3,
      action: 'compare',
      highlight: [3, 4],
      state: {
        tree: cloneTree(tree),
        value: val,
        currentNode: node.val,
        direction: val < node.val ? 'left' : 'right',
        path: [...path],
      },
    });

    if (val < node.val) {
      path.push({ node: node.val, direction: 'left' });
      node.left = insertWithTrace(node.left, val);
    } else {
      path.push({ node: node.val, direction: 'right' });
      node.right = insertWithTrace(node.right, val);
    }
    return node;
  }

  insertWithTrace(tree, newValue);

  trace.push({
    step: step++,
    line: 8,
    action: 'done',
    highlight: [],
    state: { tree: cloneTree(tree), value: newValue, path },
  });

  return trace;
}

// ── BST Search ───────────────────────────────────────────────────────────────
function bstSearchTrace(values = [5, 3, 7, 1, 4, 6, 9], target = 4) {
  const trace = [];
  let step = 1;
  const tree = buildTree(values);

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1],
    state: { tree: cloneTree(tree), target, currentNode: null, path: [] },
  });

  const path = [];

  function searchWithTrace(node, val) {
    if (!node) {
      trace.push({
        step: step++,
        line: 2,
        action: 'not_found',
        highlight: [2],
        state: { tree: cloneTree(tree), target: val, found: false, path: [...path] },
      });
      return false;
    }

    trace.push({
      step: step++,
      line: 3,
      action: 'visit',
      highlight: [3],
      state: { tree: cloneTree(tree), target: val, currentNode: node.val, path: [...path] },
    });

    if (node.val === val) {
      trace.push({
        step: step++,
        line: 4,
        action: 'found',
        highlight: [4],
        state: { tree: cloneTree(tree), target: val, foundAt: node.val, path: [...path] },
      });
      return true;
    }

    if (val < node.val) {
      path.push({ node: node.val, direction: 'left' });
      trace.push({
        step: step++,
        line: 6,
        action: 'go_left',
        highlight: [6],
        state: { tree: cloneTree(tree), target: val, currentNode: node.val, path: [...path] },
      });
      return searchWithTrace(node.left, val);
    } else {
      path.push({ node: node.val, direction: 'right' });
      trace.push({
        step: step++,
        line: 8,
        action: 'go_right',
        highlight: [8],
        state: { tree: cloneTree(tree), target: val, currentNode: node.val, path: [...path] },
      });
      return searchWithTrace(node.right, val);
    }
  }

  searchWithTrace(tree, target);

  trace.push({
    step: step++,
    line: 10,
    action: 'done',
    highlight: [],
    state: { tree: cloneTree(tree), target, path },
  });

  return trace;
}

// ── Inorder Traversal ────────────────────────────────────────────────────────
function inorderTrace(values = [5, 3, 7, 1, 4]) {
  const trace = [];
  let step = 1;
  const tree = buildTree(values);
  const visited = [];

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1],
    state: { tree: cloneTree(tree), visited: [] },
  });

  function inorder(node) {
    if (!node) return;
    trace.push({
      step: step++,
      line: 2,
      action: 'go_left',
      highlight: [2],
      state: { tree: cloneTree(tree), currentNode: node.val, visited: [...visited] },
    });
    inorder(node.left);

    visited.push(node.val);
    trace.push({
      step: step++,
      line: 3,
      action: 'visit',
      highlight: [3],
      state: { tree: cloneTree(tree), currentNode: node.val, visited: [...visited] },
    });

    trace.push({
      step: step++,
      line: 4,
      action: 'go_right',
      highlight: [4],
      state: { tree: cloneTree(tree), currentNode: node.val, visited: [...visited] },
    });
    inorder(node.right);
  }

  inorder(tree);

  trace.push({
    step: step++,
    line: 6,
    action: 'done',
    highlight: [],
    state: { tree: cloneTree(tree), visited: [...visited] },
  });

  return trace;
}

// ── Preorder Traversal ───────────────────────────────────────────────────────
function preorderTrace(values = [5, 3, 7, 1, 4]) {
  const trace = [];
  let step = 1;
  const tree = buildTree(values);
  const visited = [];

  trace.push({
    step: step++,
    line: 1,
    action: 'start',
    highlight: [1],
    state: { tree: cloneTree(tree), visited: [] },
  });

  function preorder(node) {
    if (!node) return;
    visited.push(node.val);
    trace.push({
      step: step++,
      line: 2,
      action: 'visit',
      highlight: [2],
      state: { tree: cloneTree(tree), currentNode: node.val, visited: [...visited] },
    });
    preorder(node.left);
    preorder(node.right);
  }

  preorder(tree);

  trace.push({
    step: step++,
    line: 5,
    action: 'done',
    highlight: [],
    state: { tree: cloneTree(tree), visited: [...visited] },
  });

  return trace;
}

module.exports = {
  bstInsertTrace,
  bstSearchTrace,
  inorderTrace,
  preorderTrace,
};
