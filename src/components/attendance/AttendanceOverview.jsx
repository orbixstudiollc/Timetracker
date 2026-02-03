import { Users, UserCheck, Clock, UserX } from 'lucide-react'
import { Card, CardContent } from '../common/Card'
import { Avatar } from '../common/Avatar'
import { StatusIndicator } from '../common/StatusIndicator'
import { useApp } from '../../context/AppContext'

export default function AttendanceOverview() {
  const { state } = useApp()

  const statusCounts = state.teamMembers.reduce(
    (acc, member) => {
      acc[member.status] = (acc[member.status] || 0) + 1
      return acc
    },
    { active: 0, away: 0, offline: 0 }
  )

  const stats = [
    {
      label: 'Total Team',
      value: state.teamMembers.length,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Now',
      value: statusCounts.active,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Away',
      value: statusCounts.away,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Offline',
      value: statusCounts.offline,
      icon: UserX,
      color: 'bg-gray-100 text-gray-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Team Status Overview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {state.teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50"
              >
                <div className="relative">
                  <Avatar name={member.name} size="lg" />
                  <StatusIndicator
                    status={member.status}
                    className="absolute -bottom-0.5 -right-0.5"
                  />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                    {member.name.split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {member.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
