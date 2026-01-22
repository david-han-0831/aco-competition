import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  onConfirm?: () => void
  confirmText?: string
}

export default function SuccessModal({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = '확인',
}: SuccessModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <p className="text-lg text-foreground font-medium">
            {message}
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            onClick={handleConfirm}
            className="bg-primary-burgundy hover:bg-primary-wine text-white px-8 py-6 rounded-xl font-semibold shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
