import { mockStudies } from '@/mock/mockStudies'

export const calculateStats = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const studiesToday = mockStudies.filter((study) => {
    const studyDate = new Date(study.date)
    studyDate.setHours(0, 0, 0, 0)
    return studyDate.getTime() === today.getTime()
  })
  
  const totalStudiesToday = studiesToday.length
  const currentlyRunning = mockStudies.filter((s) => s.status === 'running').length
  const completed = mockStudies.filter((s) => s.status === 'completed').length
  const failed = mockStudies.filter((s) => s.status === 'failed').length
  
  return {
    totalStudiesToday,
    currentlyRunning,
    completed,
    failed,
  }
}

