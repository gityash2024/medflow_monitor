const modalities = ['CT', 'MR', 'XR', 'US', 'NM', 'PT']
const statuses = ['waiting', 'running', 'completed', 'failed']
const descriptions = {
  CT: ['CT Brain Study', 'CT Chest Study', 'CT Abdomen Study', 'CT Spine Study'],
  MR: ['MR Brain Study', 'MR Spine Study', 'MR Knee Study', 'MR Shoulder Study'],
  XR: ['XR Chest Study', 'XR Extremity Study', 'XR Spine Study', 'XR Pelvis Study'],
  US: ['US Abdomen Study', 'US Pelvis Study', 'US Thyroid Study'],
  NM: ['NM Bone Scan', 'NM Cardiac Study'],
  PT: ['PT Brain Study', 'PT Whole Body Study'],
}

const generateStudyUID = () => {
  return `1.2.840.113619.2.${Math.floor(Math.random() * 1000)}.${Date.now()}${Math.floor(Math.random() * 1000)}`
}

const generatePatientID = (index) => {
  return `PAT${String(index).padStart(6, '0')}`
}

const generateDate = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  return date
}

const generateDuration = () => {
  const minutes = Math.floor(Math.random() * 10) + 1
  const seconds = Math.floor(Math.random() * 60)
  return `${minutes}m ${seconds}s`
}

export const generateMockStudies = (count = 50) => {
  const studies = []
  for (let i = 0; i < count; i++) {
    const modality = modalities[Math.floor(Math.random() * modalities.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const description = descriptions[modality][Math.floor(Math.random() * descriptions[modality].length)]
    const daysAgo = Math.floor(Math.random() * 7)
    const date = generateDate(daysAgo)
    
    studies.push({
      id: i + 1,
      studyUID: generateStudyUID(),
      patientID: generatePatientID(i + 1),
      modality,
      description,
      date: date.toISOString(),
      status,
      duration: status === 'completed' ? generateDuration() : null,
      currentStage: status === 'completed' ? 6 : status === 'failed' ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 6) + 1,
    })
  }
  return studies.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const mockStudies = generateMockStudies(50)

export const dashboardStats = {
  totalStudiesToday: 101,
  currentlyRunning: 6,
  completed: 66,
  failed: 1,
  uptimePercentage: 99.9,
  avgProcessingTime: '2.5min',
}

export const livePipeline = [
  {
    id: 'study-1',
    studyUID: '1.2.840.113619.2.139.176966435...',
    modality: 'XR',
    description: 'XR Extremity Study',
    status: 'running',
    currentStage: 4,
    stages: ['completed', 'completed', 'completed', 'completed', 'running', 'waiting'],
  },
  {
    id: 'study-2',
    studyUID: '1.2.840.113619.2.540.1769...',
    modality: 'CT',
    description: 'CT Brain Study',
    status: 'running',
    currentStage: 2,
    stages: ['completed', 'completed', 'running', 'waiting', 'waiting', 'waiting'],
  },
  {
    id: 'study-3',
    studyUID: '1.2.840.113619.2.517.1769...',
    modality: 'MR',
    description: 'MR Spine Study',
    status: 'running',
    currentStage: 5,
    stages: ['completed', 'completed', 'completed', 'completed', 'completed', 'running'],
  },
]

export const studyDetails = {
  studyUID: '1.2.840.113619.2.229.176966438187...',
  patientID: 'PAT001044',
  modality: 'CT',
  description: 'CT Brain Study',
  studyDate: '2026-01-29 03:56',
  received: '2026-01-28 13:56',
  lastUpdated: '2026-01-29 10:56',
  status: 'completed',
  totalDuration: '4m 27s',
  currentStage: 6,
  pipelineLogs: [
    {
      stage: 'Received',
      timestamp: '10:26:21',
      server: 'server-3.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Anonymization',
      timestamp: '10:27:15',
      server: 'server-3.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Sent to XNAT',
      timestamp: '10:28:42',
      server: 'server-1.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Stored in XNAT',
      timestamp: '10:29:18',
      server: 'server-1.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Report Generated',
      timestamp: '10:30:05',
      server: 'server-2.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Report Synced',
      timestamp: '10:30:48',
      server: 'server-2.hospital.local',
      status: 'complete',
      icon: 'check',
    },
  ],
  report: {
    filename: 'report_CT_1769664381875.pdf',
    generated: 'Jan 29, 2026 10:56',
  },
}

export const failedStudyDetails = {
  studyUID: '1.2.840.113619.2.805.1769...',
  patientID: 'PAT001035',
  modality: 'XR',
  description: 'XR Chest Study',
  studyDate: '2026-01-29 06:56',
  received: '2026-01-29 06:56',
  lastUpdated: '2026-01-29 10:56',
  status: 'failed',
  totalDuration: null,
  currentStage: 3,
  error: {
    message: 'Connection timeout to XNAT server',
    code: 'XNAT_001',
    timestamp: 'Jan 29, 2026 10:56',
  },
  pipelineLogs: [
    {
      stage: 'Received',
      timestamp: '10:26:21',
      server: 'server-3.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Anonymization',
      timestamp: '10:27:15',
      server: 'server-3.hospital.local',
      status: 'complete',
      icon: 'check',
    },
    {
      stage: 'Sent to XNAT',
      timestamp: '10:28:42',
      server: 'server-1.hospital.local',
      status: 'failed',
      icon: 'x',
    },
  ],
}

