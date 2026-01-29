const modalities = ['CT', 'MR', 'XR', 'US', 'NM', 'PT']

const generateReport = (index) => {
  const modality = modalities[Math.floor(Math.random() * modalities.length)]
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 7))
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  
  return {
    id: index + 1,
    studyUID: `1.2.840.113619.2.${Math.floor(Math.random() * 1000)}.${Date.now()}${Math.floor(Math.random() * 1000)}`,
    patientID: `PAT${String(index + 1).padStart(6, '0')}`,
    modality,
    reportFilename: `report_${modality}_${Date.now() - Math.floor(Math.random() * 1000000)}.pdf`,
    generated: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + 
               date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }
}

export const mockReports = Array.from({ length: 23 }, (_, i) => generateReport(i))

