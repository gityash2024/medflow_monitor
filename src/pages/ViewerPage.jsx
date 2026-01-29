import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, FileSearch, Ruler, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ViewerPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ExternalLink className="mb-4 h-16 w-16 text-muted-foreground mx-auto" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-2xl font-semibold"
            >
              OHIF Viewer Integration
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-muted-foreground"
            >
              Select a study from the Studies page to view it in the integrated OHIF DICOM viewer
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={() => navigate('/studies')} size="lg">
                Go to Studies
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 w-full"
            >
              <Card>
                <CardContent className="pt-6">
                  <FileSearch className="mb-4 h-8 w-8 text-primary mx-auto" />
                  <h4 className="mb-2 font-semibold">Multi-Format Support</h4>
                  <p className="text-sm text-muted-foreground">
                    View CT, MR, XR, US, and other DICOM modalities
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Ruler className="mb-4 h-8 w-8 text-secondary mx-auto" />
                  <h4 className="mb-2 font-semibold">Measurement Tools</h4>
                  <p className="text-sm text-muted-foreground">
                    Built-in measurement and annotation tools
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Shield className="mb-4 h-8 w-8 text-success mx-auto" />
                  <h4 className="mb-2 font-semibold">Secure Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Token-based authentication ensures secure access
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

