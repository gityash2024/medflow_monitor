const actions = [
  { name: 'User Logout', icon: 'log-out' },
  { name: 'User Login', icon: 'log-in' },
  { name: 'Viewer Opened', icon: 'external-link' },
  { name: 'Study Viewed', icon: 'eye' },
  { name: 'Report Downloaded', icon: 'download' },
]

const users = ['Dr. Sarah Chen', 'Dr. Michael Ross', 'James Wilson', 'Emily Davis']

const generateIP = () => {
  return `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`
}

const generateTimestamp = (minutesAgo) => {
  const date = new Date()
  date.setMinutes(date.getMinutes() - minutesAgo)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' ' + date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

export const generateMockAuditLogs = (count = 50) => {
  const logs = []
  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const minutesAgo = i * 2 + Math.floor(Math.random() * 5)
    
    logs.push({
      id: i + 1,
      user,
      action: action.name,
      resource: action.name.includes('Study') || action.name.includes('Viewer') 
        ? `study-${Math.floor(Math.random() * 20) + 1}` 
        : null,
      ip: generateIP(),
      timestamp: generateTimestamp(minutesAgo),
      icon: action.icon,
    })
  }
  return logs
}

export const mockAuditLogs = generateMockAuditLogs(50)



