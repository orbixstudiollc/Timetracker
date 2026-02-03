export function calculateTotalHours(timeEntries) {
  return timeEntries.reduce((sum, entry) => sum + entry.hours, 0)
}

export function calculateBillableHours(timeEntries) {
  return timeEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + entry.hours, 0)
}

export function calculateTotalAmount(timeEntries) {
  return timeEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
}

export function calculateBillableAmount(timeEntries) {
  return timeEntries
    .filter(entry => entry.billable)
    .reduce((sum, entry) => sum + (entry.amount || 0), 0)
}

export function calculateProjectProgress(tasks) {
  if (!tasks || tasks.length === 0) return 0
  const completed = tasks.filter(t => t.status === 'completed').length
  return Math.round((completed / tasks.length) * 100)
}

export function calculateProjectSpent(timeEntries) {
  return timeEntries.reduce((sum, entry) => {
    if (entry.billable) {
      return sum + (entry.hours * entry.hourlyRate)
    }
    return sum
  }, 0)
}

export function calculateBudgetUtilization(spent, budget) {
  if (budget === 0) return 0
  return Math.round((spent / budget) * 100)
}

export function calculateAverageHoursPerDay(totalHours, days) {
  if (days === 0) return 0
  return totalHours / days
}

export function calculateProductivity(billableHours, totalHours) {
  if (totalHours === 0) return 0
  return Math.round((billableHours / totalHours) * 100)
}

export function groupTimeEntriesByDate(timeEntries) {
  return timeEntries.reduce((acc, entry) => {
    const date = entry.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(entry)
    return acc
  }, {})
}

export function groupTimeEntriesByProject(timeEntries) {
  return timeEntries.reduce((acc, entry) => {
    const projectId = entry.projectId
    if (!acc[projectId]) {
      acc[projectId] = []
    }
    acc[projectId].push(entry)
    return acc
  }, {})
}

export function groupTimeEntriesByMember(timeEntries) {
  return timeEntries.reduce((acc, entry) => {
    const memberId = entry.teamMemberId
    if (!acc[memberId]) {
      acc[memberId] = []
    }
    acc[memberId].push(entry)
    return acc
  }, {})
}

export function getTopProjects(projects, timeEntries, limit = 5) {
  const projectHours = projects.map(project => {
    const projectEntries = timeEntries.filter(e => e.projectId === project.id)
    return {
      ...project,
      totalHours: calculateTotalHours(projectEntries),
    }
  })
  return projectHours.sort((a, b) => b.totalHours - a.totalHours).slice(0, limit)
}

export function getTopMembers(teamMembers, timeEntries, limit = 5) {
  const memberHours = teamMembers.map(member => {
    const memberEntries = timeEntries.filter(e => e.teamMemberId === member.id)
    return {
      ...member,
      totalHours: calculateTotalHours(memberEntries),
      billableHours: calculateBillableHours(memberEntries),
    }
  })
  return memberHours.sort((a, b) => b.totalHours - a.totalHours).slice(0, limit)
}

export function calculateLeaveBalance(leaveRequests, annualAllowance = 20) {
  const approvedLeaves = leaveRequests.filter(
    lr => lr.status === 'approved' && lr.type === 'annual'
  )
  const usedDays = approvedLeaves.reduce((sum, lr) => sum + lr.totalDays, 0)
  return annualAllowance - usedDays
}
