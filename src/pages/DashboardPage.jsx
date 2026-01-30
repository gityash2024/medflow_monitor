import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, FileText, Activity, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataLoader } from '@/components/ui/DataLoader'
import { dashboardStats, livePipeline, mockStudies } from '@/mock/mockStudies'
import { useNavigate } from 'react-router-dom'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState(dashboardStats)

  // Initial loading delay for mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'running':
        return 'default'
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getModalityColor = (modality) => {
    const colors = {
      CT: 'default',
      MR: 'secondary',
      XR: 'success',
      US: 'warning',
      NM: 'accent',
      PT: 'outline',
    }
    return colors[modality] || 'outline'
  }

  const getStageStatus = (stage, index, currentStage) => {
    if (stage === 'completed') return 'completed'
    if (stage === 'running') return 'running'
    if (index < currentStage) return 'completed'
    return 'waiting'
  }

  const recentStudies = mockStudies.slice(0, 10)

  // Show loader while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <DataLoader message="Loading dashboard data..." />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Monitor your DICOM pipeline in real-time</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Studies Today</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudiesToday}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Currently Running</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentlyRunning}</div>
              <p className="text-xs text-muted-foreground">Active processing</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Pipeline */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Live Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {livePipeline.map((study) => {
                // Find matching study from mockStudies
                const matchingStudy = mockStudies.find((s) =>
                  s.studyUID.includes(study.studyUID.split('...')[0])
                ) || mockStudies[0] // Fallback to first study

                return (
                  <div
                    key={study.id}
                    onClick={() => navigate(`/studies/${matchingStudy.id}`)}
                    className="rounded-lg border border-black/10 dark:border-white/20 bg-card/30 backdrop-blur-sm p-4 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getModalityColor(study.modality)}>
                            {study.modality}
                          </Badge>
                          <span className="text-sm font-medium">{study.description}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {study.studyUID}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(study.status)}>
                        {study.status === 'running' && (
                          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-current" />
                        )}
                        {study.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {['Received', 'Anonymization', 'Sent to XNAT', 'Stored in XNAT', 'Report Generated', 'Report Synced'].map((stage, index) => {
                        const status = getStageStatus(study.stages[index], index, study.currentStage)
                        return (
                          <div key={stage} className="flex-1 min-w-[100px]">
                            <div className="mb-1 flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{stage}</span>
                              {status === 'completed' && (
                                <CheckCircle2 className="h-3 w-3 text-success" />
                              )}
                              {status === 'running' && (
                                <Activity className="h-3 w-3 animate-pulse text-primary" />
                              )}
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className={`h-full ${status === 'completed'
                                  ? 'bg-success'
                                  : status === 'running'
                                    ? 'bg-primary'
                                    : 'bg-muted'
                                  }`}
                                initial={{ width: 0 }}
                                animate={{
                                  width:
                                    status === 'completed'
                                      ? '100%'
                                      : status === 'running'
                                        ? '50%'
                                        : '0%',
                                }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Studies */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Studies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentStudies.map((study) => (
                <div
                  key={study.id}
                  onClick={() => navigate(`/studies/${study.id}`)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-black/10 dark:border-white/20 bg-card/30 backdrop-blur-sm p-3 cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 flex-1">
                    <Badge variant={getModalityColor(study.modality)}>
                      {study.modality}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{study.description}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {study.studyUID}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(study.date).toLocaleString()}
                    </div>
                    <Badge variant={getStatusColor(study.status)}>
                      {study.status}
                    </Badge>
                    {study.duration && (
                      <div className="text-xs text-muted-foreground hidden md:block">
                        {study.duration}
                      </div>
                    )}
                    {study.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/studies/${study.id}`)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

