/**
 * Trace generators for sorting algorithms.
 * Each function returns a trace array of step objects.
 * Default sample: [5, 3, 8, 1, 9, 2]
 */

const SAMPLE = [5, 3, 8, 1, 9, 2];

// ── Bubble Sort ──────────────────────────────────────────────────────────────
function bubbleSortTrace(arr = [...SAMPLE]) {
  const trace = [];
  const a = [...arr];
  let step = 1;
  const sorted = new Set();

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      trace.push({
        step: step++,
        line: 3,
        action: 'compare',
        highlight: [3, 4],
        state: { arr: [...a], i, j, comparing: [j, j + 1], sorted: [...sorted] },
      });

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        trace.push({
          step: step++,
          line: 5,
          action: 'swap',
          highlight: [5, 6],
          state: { arr: [...a], i, j, swapped: [j, j + 1], sorted: [...sorted] },
        });
      }
    }
    sorted.add(a.length - 1 - i);
    trace.push({
      step: step++,
      line: 2,
      action: 'sorted',
      highlight: [2],
      state: { arr: [...a], index: a.length - 1 - i, sorted: [...sorted] },
    });
  }
  sorted.add(0);
  trace.push({
    step: step++,
    line: 8,
    action: 'done',
    highlight: [],
    state: { arr: [...a], sorted: [...sorted] },
  });

  return trace;
}

// ── Selection Sort ──────────────────────────────────────────────────────────
function selectionSortTrace(arr = [...SAMPLE]) {
  const trace = [];
  const a = [...arr];
  let step = 1;
  const sorted = new Set();

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    trace.push({
      step: step++,
      line: 2,
      action: 'set_min',
      highlight: [2, 3],
      state: { arr: [...a], i, minIdx, sorted: [...sorted] },
    });

    for (let j = i + 1; j < a.length; j++) {
      trace.push({
        step: step++,
        line: 4,
        action: 'compare',
        highlight: [4, 5],
        state: { arr: [...a], i, j, minIdx, sorted: [...sorted] },
      });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        trace.push({
          step: step++,
          line: 5,
          action: 'update_min',
          highlight: [5],
          state: { arr: [...a], i, j, minIdx, sorted: [...sorted] },
        });
      }
    }

    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      trace.push({
        step: step++,
        line: 8,
        action: 'swap',
        highlight: [8, 9],
        state: { arr: [...a], i, minIdx, swapped: [i, minIdx], sorted: [...sorted] },
      });
    }
    sorted.add(i);
    trace.push({
      step: step++,
      line: 1,
      action: 'sorted',
      highlight: [1],
      state: { arr: [...a], index: i, sorted: [...sorted] },
    });
  }
  sorted.add(a.length - 1);
  trace.push({
    step: step++,
    line: 10,
    action: 'done',
    highlight: [],
    state: { arr: [...a], sorted: [...sorted] },
  });

  return trace;
}

// ── Insertion Sort ───────────────────────────────────────────────────────────
function insertionSortTrace(arr = [...SAMPLE]) {
  const trace = [];
  const a = [...arr];
  let step = 1;

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    trace.push({
      step: step++,
      line: 2,
      action: 'pick_key',
      highlight: [2],
      state: { arr: [...a], i, j, key, sortedEnd: i - 1 },
    });

    while (j >= 0 && a[j] > key) {
      trace.push({
        step: step++,
        line: 4,
        action: 'compare',
        highlight: [4, 5],
        state: { arr: [...a], i, j, key, sortedEnd: i - 1 },
      });
      a[j + 1] = a[j];
      j--;
      trace.push({
        step: step++,
        line: 5,
        action: 'shift',
        highlight: [5],
        state: { arr: [...a], i, j: j + 1, key, sortedEnd: i - 1 },
      });
    }

    a[j + 1] = key;
    trace.push({
      step: step++,
      line: 7,
      action: 'insert',
      highlight: [7],
      state: { arr: [...a], i, j: j + 1, key, sortedEnd: i },
    });
  }

  trace.push({
    step: step++,
    line: 9,
    action: 'done',
    highlight: [],
    state: { arr: [...a], sorted: a.map((_, idx) => idx) },
  });

  return trace;
}

// ── Merge Sort ───────────────────────────────────────────────────────────────
function mergeSortTrace(arr = [...SAMPLE]) {
  const trace = [];
  let step = 1;
  const a = [...arr];

  function mergeSort(array, left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    trace.push({
      step: step++,
      line: 2,
      action: 'divide',
      highlight: [2, 3],
      state: { arr: [...a], left, mid, right, phase: 'divide' },
    });

    mergeSort(array, left, mid);
    mergeSort(array, mid + 1, right);

    // merge
    const leftPart  = array.slice(left, mid + 1);
    const rightPart = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftPart.length && j < rightPart.length) {
      trace.push({
        step: step++,
        line: 7,
        action: 'compare',
        highlight: [7, 8],
        state: { arr: [...a], left, mid, right, phase: 'merge', comparing: [left + i, mid + 1 + j] },
      });
      if (leftPart[i] <= rightPart[j]) {
        array[k++] = leftPart[i++];
      } else {
        array[k++] = rightPart[j++];
      }
      a.splice(left, right - left + 1, ...array.slice(left, right + 1));
      trace.push({
        step: step++,
        line: 9,
        action: 'merge_place',
        highlight: [9],
        state: { arr: [...a], left, mid, right, phase: 'merge', mergedUpTo: k - 1 },
      });
    }
    while (i < leftPart.length) { array[k++] = leftPart[i++]; }
    while (j < rightPart.length) { array[k++] = rightPart[j++]; }
    a.splice(left, right - left + 1, ...array.slice(left, right + 1));

    trace.push({
      step: step++,
      line: 12,
      action: 'merged',
      highlight: [12],
      state: { arr: [...a], left, right, phase: 'merged' },
    });
  }

  mergeSort(a, 0, a.length - 1);

  trace.push({
    step: step++,
    line: 14,
    action: 'done',
    highlight: [],
    state: { arr: [...a] },
  });

  return trace;
}

// ── Quick Sort ───────────────────────────────────────────────────────────────
function quickSortTrace(arr = [...SAMPLE]) {
  const trace = [];
  let step = 1;
  const a = [...arr];

  function quickSort(array, low, high) {
    if (low >= high) return;

    const pivot = array[high];
    trace.push({
      step: step++,
      line: 2,
      action: 'pivot',
      highlight: [2],
      state: { arr: [...a], low, high, pivotIdx: high, pivot },
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      trace.push({
        step: step++,
        line: 5,
        action: 'compare',
        highlight: [5, 6],
        state: { arr: [...a], low, high, pivotIdx: high, pivot, i, j },
      });
      if (array[j] <= pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        a.splice(0, a.length, ...array);
        trace.push({
          step: step++,
          line: 7,
          action: 'swap',
          highlight: [7],
          state: { arr: [...a], low, high, pivotIdx: high, pivot, i, j, swapped: [i, j] },
        });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    a.splice(0, a.length, ...array);
    const pi = i + 1;

    trace.push({
      step: step++,
      line: 10,
      action: 'place_pivot',
      highlight: [10],
      state: { arr: [...a], low, high, pivotIdx: pi, pivot, sortedIndex: pi },
    });

    quickSort(array, low, pi - 1);
    quickSort(array, pi + 1, high);
  }

  quickSort(a, 0, a.length - 1);

  trace.push({
    step: step++,
    line: 12,
    action: 'done',
    highlight: [],
    state: { arr: [...a] },
  });

  return trace;
}

module.exports = {
  bubbleSortTrace,
  selectionSortTrace,
  insertionSortTrace,
  mergeSortTrace,
  quickSortTrace,
};
