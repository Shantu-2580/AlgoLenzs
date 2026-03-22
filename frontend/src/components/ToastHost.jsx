export default function ToastHost({ toasts, dismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-lg border border-danger/60 bg-surface/90 px-4 py-3 text-sm text-text-main shadow-lg backdrop-blur"
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.message}</p>
            <button
              className="text-xs text-text-muted transition hover:text-text-main"
              onClick={() => dismiss(toast.id)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
