import { FolderKanban, Users, Clock, DollarSign } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatHours } from '../../utils/formatters'
import { calculateTotalHours, calculateBillableAmount } from '../../utils/calculations'

export function MetricsGrid() {
  const { state } = useApp()

  const activeProjects = state.projects.filter(p =>
    p.status === 'in-progress' || p.status === 'planning'
  ).length

  const teamSize = state.teamMembers.length

  const totalHours = calculateTotalHours(state.timeEntries)
  const totalRevenue = calculateBillableAmount(state.timeEntries)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Projects"
        value={activeProjects}
        subtitle={`${state.projects.length} total projects`}
        icon={FolderKanban}
      />
      <MetricCard
        title="Team Members"
        value={teamSize}
        subtitle={`${state.teamMembers.filter(m => m.status === 'active').length} currently active`}
        icon={Users}
      />
      <MetricCard
        title="Hours Logged"
        value={formatHours(totalHours)}
        subtitle="This month"
        icon={Clock}
        trend="12% from last month"
        trendUp={true}
      />
      <MetricCard
        title="Revenue"
        value={formatCurrency(totalRevenue)}
        subtitle="Billable amount"
        icon={DollarSign}
        trend="8% from last month"
        trendUp={true}
      />
    </div>
  )
}
