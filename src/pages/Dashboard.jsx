import {
  MetricsGrid,
  ActiveTimer,
  RecentProjects,
  TeamActivityFeed,
  LatestTimeEntries,
} from '../components/dashboard'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <MetricsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProjects />
        </div>
        <div>
          <ActiveTimer />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LatestTimeEntries />
        </div>
        <div>
          <TeamActivityFeed />
        </div>
      </div>
    </div>
  )
}
