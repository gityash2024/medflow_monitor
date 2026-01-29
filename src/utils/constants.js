export const ROLES = {
  ADMINISTRATOR: 'Administrator',
  TECHNICIAN: 'Technician',
  RADIOLOGIST: 'Radiologist',
  VIEWER: 'Viewer',
}

export const MODALITIES = ['CT', 'MR', 'XR', 'US', 'NM', 'PT']

export const STUDY_STATUSES = ['waiting', 'running', 'completed', 'failed']

export const USER_STATUSES = ['Active', 'Inactive']

export const PIPELINE_STAGES = [
  'Received',
  'Anonymization',
  'Sent to XNAT',
  'Stored in XNAT',
  'Report Generated',
  'Report Synced',
]

export const AUDIT_ACTIONS = [
  'Login',
  'Logout',
  'Study Viewed',
  'Viewer Opened',
  'Report Downloaded',
]


