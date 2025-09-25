import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { createWriteStream } from 'fs'
import path from 'path'
import archiver from 'archiver'

export async function GET() {
  try {
    // Create a temporary file to store the zip
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.mkdir(tempDir, { recursive: true })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const zipPath = path.join(tempDir, `tech-news-summarizer-${timestamp}.zip`)

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 6 } // Good compression balance
    })

    // Create a write stream
    const output = createWriteStream(zipPath)

    // Pipe archive to output stream
    archive.pipe(output)

    // Function to recursively add files to archive
    const addFilesToArchive = async (dirPath: string, zipPath: string = '') => {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name)
          const relativePath = path.join(zipPath, entry.name)
          
          if (entry.isDirectory()) {
            // Skip certain directories
            if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'temp') {
              continue
            }
            await addFilesToArchive(fullPath, relativePath)
          } else {
            // Add file to archive
            try {
              const stats = await fs.stat(fullPath)
              if (stats.size < 10 * 1024 * 1024) { // Skip files larger than 10MB
                archive.file(fullPath, { name: relativePath })
              }
            } catch (error) {
              console.warn(`Could not read file ${fullPath}:`, error)
            }
          }
        }
      } catch (error) {
        console.warn(`Could not read directory ${dirPath}:`, error)
      }
    }

    // Add all files from the project root
    const projectRoot = process.cwd()
    await addFilesToArchive(projectRoot)

    // Finalize the archive
    await new Promise<void>((resolve, reject) => {
      output.on('close', resolve)
      archive.on('error', reject)
      archive.finalize()
    })

    // Read the completed zip file
    const zipBuffer = await fs.readFile(zipPath)
    
    // Clean up temp file
    await fs.unlink(zipPath)

    // Generate filename
    const filename = `tech-news-summarizer-${timestamp}.zip`

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Error creating source code zip:', error)
    return NextResponse.json(
      { error: 'فشل في إنشاء ملف المصدر' },
      { status: 500 }
    )
  }
}