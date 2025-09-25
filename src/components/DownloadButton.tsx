'use client'

import { Button } from '@/components/ui/button'
import { Download, FileText, Package, Star } from 'lucide-react'
import Link from 'next/link'

export default function DownloadButton() {
  return (
    <Link href="/download">
      <Button 
        variant="outline" 
        size="sm"
        className="hidden sm:flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300"
      >
        <Download className="w-4 h-4" />
        تحميل الكود
      </Button>
    </Link>
  )
}