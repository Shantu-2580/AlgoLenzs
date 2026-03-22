import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import RecentTable from '../components/RecentTable'
import ToastHost from '../components/ToastHost'
import useAdminAuth from '../hooks/useAdminAuth'
import { getStats } from '../utils/api'

const CHART_COLORS = ['#00f5c4', '#7c6af7', '#facc15', '#ff4f6d', '#22d3ee']

function normalizeStats(stats) {
  return {
    total: stats?.total ?? 0,
    today: stats?.today ?? 0,
    topAlgorithm: stats?.topAlgorithm ?? 'N/A',
    topLanguage: stats?.topLanguage ?? 'N/A',
    daily: stats?.daily ?? [],
    algorithms: stats?.algorithms ?? [],
    languages: stats?.languages ?? [],
    recent: stats?.recent ?? [],
  }
}

export default function AdminPage() {
  const { authenticated, error: authError, login, logout, clearError } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [shake, setShake] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [page, setPage] = useState(1)
  const [toasts, setToasts] = useState([])

  const safeStats = useMemo(() => normalizeStats(stats), [stats])

  const pushToast = (message) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 4200)
  }

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setLoadError('')

    try {
      const data = await getStats()
      setStats(data)
    } catch {
      setLoadError('Failed to load admin analytics')
      pushToast('Failed to load admin analytics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authenticated) return
    fetchStats()
  }, [authenticated, fetchStats])

  const submitPassword = async (event) => {
    event.preventDefault()
    const ok = await login(password)
    if (!ok) {
      setShake(true)
      window.setTimeout(() => setShake(false), 350)
      pushToast('Wrong password')
    }
    setPassword('')
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-main px-4">
        <section className={`glass-card w-full max-w-md p-6 sm:p-8 ${shake ? 'animate-shake' : ''}`}>
          <h1 className="font-display text-3xl text-transparent bg-gradient-to-r from-neon-mint via-neon-purple to-neon-mint bg-clip-text">
            AlgoLens
          </h1>
          <p className="mt-2 text-sm text-text-muted">Admin Access</p>

          <form onSubmit={submitPassword} className="mt-6 space-y-3">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                clearError()
              }}
              className="w-full rounded-md border border-neon-border bg-editor px-3 py-2 text-text-main outline-none transition focus:border-neon-mint"
            />

            <button
              type="submit"
              className="w-full rounded-md bg-neon-mint px-4 py-2 font-display font-semibold text-[#03120f] transition hover:brightness-110"
            >
              Enter
            </button>
          </form>

          {authError ? <p className="mt-3 text-sm text-danger">{authError}</p> : null}
        </section>

        <ToastHost toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-bg-main pb-10">
      <div className="sticky top-0 z-30">
        <Navbar admin />
        <div className="border-b border-neon-border/70 bg-surface/70 px-4 py-3 text-right backdrop-blur md:px-6">
          <button onClick={logout} type="button" className="control-btn">
            Logout
          </button>
        </div>
      </div>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pt-4 md:px-6 md:pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Runs" value={safeStats.total} loading={loading} />
          <StatCard label="Today's Runs" value={safeStats.today} loading={loading} />
          <StatCard label="Top Algorithm" value={safeStats.topAlgorithm} loading={loading} />
          <StatCard label="Top Language" value={safeStats.topLanguage} loading={loading} />
        </div>

        {loadError ? (
          <div className="glass-card flex items-center justify-between gap-3 p-4">
            <p className="text-sm text-danger">{loadError}</p>
            <button type="button" className="control-btn" onClick={fetchStats}>
              Retry
            </button>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article className="glass-card h-[320px] p-4">
            <h3 className="font-display text-lg text-text-main">Daily Usage</h3>
            <div className="mt-3 h-[250px]">
              <ResponsiveContainer>
                <LineChart data={safeStats.daily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2c42" />
                  <XAxis dataKey="date" stroke="#5a5a7a" />
                  <YAxis stroke="#5a5a7a" />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e' }} />
                  <Line type="monotone" dataKey="count" stroke="#00f5c4" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="glass-card h-[320px] p-4">
            <h3 className="font-display text-lg text-text-main">Algorithms (Top 5)</h3>
            <div className="mt-3 h-[250px]">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={safeStats.algorithms.slice(0, 5)} dataKey="count" nameKey="name" outerRadius={90} innerRadius={55}>
                    {safeStats.algorithms.slice(0, 5).map((entry, idx) => (
                      <Cell key={entry.name} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        <article className="glass-card h-[320px] p-4">
          <h3 className="font-display text-lg text-text-main">Language Breakdown</h3>
          <div className="mt-3 h-[250px]">
            <ResponsiveContainer>
              <BarChart data={safeStats.languages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2c42" />
                <XAxis dataKey="name" stroke="#5a5a7a" />
                <YAxis stroke="#5a5a7a" />
                <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {safeStats.languages.map((entry, idx) => (
                    <Cell key={entry.name} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <RecentTable items={safeStats.recent.slice(0, 20)} page={page} setPage={setPage} />
      </section>

      <ToastHost toasts={toasts} dismiss={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))} />
    </main>
  )
}
