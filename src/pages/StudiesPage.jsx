import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Eye, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockStudies } from '@/mock/mockStudies'
import { MODALITIES, STUDY_STATUSES } from '@/utils/constants'
import { format } from 'date-fns'

export default function StudiesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [modalityFilter, setModalityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredStudies = useMemo(() => {
    return mockStudies.filter((study) => {
      const matchesSearch =
        study.studyUID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.patientID.toLowerCase().includes(searchQuery.toLowerCase()) ||
        study.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesModality = modalityFilter === 'all' || study.modality === modalityFilter
      const matchesStatus = statusFilter === 'all' || study.status === statusFilter
      return matchesSearch && matchesModality && matchesStatus
    })
  }, [searchQuery, modalityFilter, statusFilter])

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold">Studies</h1>
        <p className="text-muted-foreground">View and manage all DICOM studies</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Study UID, Patient ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Modalities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modalities</SelectItem>
                {MODALITIES.map((mod) => (
                  <SelectItem key={mod} value={mod}>
                    {mod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STUDY_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredStudies.length} of {mockStudies.length} studies
          </div>
        </CardContent>
      </Card>

      {/* Studies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Studies</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStudies.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No studies found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center justify-between rounded-lg border border-black/10 dark:border-white/20 bg-card/30 backdrop-blur-sm p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Badge variant={getModalityColor(study.modality)}>
                      {study.modality}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{study.description}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {study.studyUID}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Patient ID: {study.patientID}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(study.date), 'MMM dd, yyyy HH:mm')}
                    </div>
                    <Badge variant={getStatusColor(study.status)}>
                      {study.status}
                    </Badge>
                    {study.duration && (
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {study.duration}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/studies/${study.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {study.status === 'completed' && (
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

