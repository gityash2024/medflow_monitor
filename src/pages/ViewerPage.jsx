import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, FileSearch, Ruler, Shield, PlayCircle, Image, Grid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Import all DICOM samples dynamically to get the count/filenames
const dicomFiles = import.meta.glob('/src/assets/dicom_samples/*.dic', { eager: true, as: 'url' })
const fileNames = Object.keys(dicomFiles).map(path => path.split('/').pop())

export default function ViewerPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center min-h-[80vh] p-4 py-12 space-y-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl text-center space-y-6"
      >
        <div className="space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Advanced DICOM Viewer
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a series image below to launch the high-performance viewer.
            </p>
          </motion.div>
        </div>

        {/* Series Grid */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Grid className="h-5 w-5 text-primary" />
              Available Series ({fileNames.length} Images)
            </h3>
            <Badge variant="outline">Study: DEMO-001</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fileNames.map((name, index) => (
              <Card
                key={name}
                className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden border-slate-700 bg-slate-800/50"
                onClick={() => window.open(`/viewer/mock?study=DEMO-001&index=${index}`, '_blank')}
              >
                <CardContent className="p-0">
                  <div className="aspect-square bg-slate-900 flex items-center justify-center relative group-hover:bg-slate-800 transition-colors">
                    <Image className="h-12 w-12 text-slate-700 group-hover:text-primary/50 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                      <PlayCircle className="h-10 w-10 text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform" />
                    </div>
                    <Badge variant="secondary" className="absolute top-2 right-2 text-[10px] h-5 px-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Instance {index + 1}
                    </Badge>
                  </div>
                  <div className="p-3 bg-card/90 border-t border-slate-700">
                    <p className="text-xs font-mono text-muted-foreground truncate" title={name}>
                      {name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
