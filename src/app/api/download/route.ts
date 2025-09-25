import { NextRequest, NextResponse } from 'next/server'
import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { createHash } from 'crypto'
import archiver from 'archiver'

interface FileToZip {
  path: string
  name: string
  isDirectory: boolean
  size?: number
}

// Files and directories to exclude from the ZIP
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  '*.tmp',
  '*.temp',
  'coverage',
  '.nyc_output',
  '.vscode',
  '.idea',
  '*.swp',
  '*.swo',
  '*~'
]

function shouldExclude(filePath: string): boolean {
  const fileName = filePath.split('/').pop() || ''
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(fileName)
    }
    return filePath.includes(pattern) || fileName === pattern
  })
}

function getAllFiles(dir: string, baseDir: string = dir): FileToZip[] {
  const files: FileToZip[] = []
  
  if (!existsSync(dir)) {
    return files
  }

  const items = readdirSync(dir)
  
  for (const item of items) {
    const fullPath = join(dir, item)
    const relativePath = relative(baseDir, fullPath)
    
    if (shouldExclude(relativePath)) {
      continue
    }

    try {
      const stats = statSync(fullPath)
      
      if (stats.isDirectory()) {
        files.push({
          path: relativePath,
          name: item,
          isDirectory: true
        })
        files.push(...getAllFiles(fullPath, baseDir))
      } else {
        files.push({
          path: relativePath,
          name: item,
          isDirectory: false,
          size: stats.size
        })
      }
    } catch (error) {
      console.warn(`Could not access ${fullPath}:`, error)
    }
  }
  
  return files
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting download process...')
    
    const projectRoot = process.cwd()
    console.log('📁 Project root:', projectRoot)
    
    const files = getAllFiles(projectRoot)
    console.log(`📊 Found ${files.length} total items`)
    
    // Filter to only include files (not directories)
    const fileFiles = files.filter(file => !file.isDirectory)
    console.log(`📄 Found ${fileFiles.length} files to zip`)
    
    // Calculate total size
    const totalSize = fileFiles.reduce((sum, file) => sum + (file.size || 0), 0)
    console.log(`💾 Total size: ${totalSize} bytes (${(totalSize / 1024 / 1024).toFixed(2)} MB)`)
    
    // Create ZIP archive
    console.log('📦 Creating ZIP archive...')
    const archive = archiver('zip', {
      zlib: { level: 6 } // Good compression balance
    })

    // Set up error handling
    archive.on('error', (err) => {
      console.error('❌ Archive error:', err)
      throw err
    })

    // Create a buffer to store the ZIP data
    const chunks: Buffer[] = []
    
    archive.on('data', (chunk) => {
      chunks.push(chunk)
    })

    archive.on('end', () => {
      console.log('✅ Archive creation completed')
    })

    // Add files to archive
    console.log('📂 Adding files to archive...')
    let addedCount = 0
    for (const file of fileFiles) {
      const fullPath = join(projectRoot, file.path)
      try {
        archive.file(fullPath, { name: file.path })
        addedCount++
        
        if (addedCount % 20 === 0) {
          console.log(`📝 Added ${addedCount}/${fileFiles.length} files...`)
        }
      } catch (error) {
        console.warn(`⚠️ Could not add file ${file.path} to archive:`, error)
      }
    }
    console.log(`✅ Successfully added ${addedCount} files to archive`)

    // Finalize the archive and wait for completion
    console.log('🔒 Finalizing archive...')
    await new Promise<void>((resolve, reject) => {
      archive.on('end', () => {
        console.log('✅ Archive finalized successfully')
        resolve()
      })
      archive.on('error', reject)
      archive.finalize()
    })

    // Combine all chunks into a single buffer
    const zipBuffer = Buffer.concat(chunks)
    console.log(`📦 ZIP buffer created, size: ${zipBuffer.length} bytes (${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB)`)
    
    // Generate a filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const projectName = 'arabic-tech-news-summarizer'
    const filename = `${projectName}-${timestamp}.zip`

    console.log(`📄 Generated filename: ${filename}`)
    console.log('🚀 Sending response...')

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Files-Count': fileFiles.length.toString(),
        'X-Content-Total-Size': totalSize.toString(),
        'X-Project-Name': projectName,
        'X-Generated-At': new Date().toISOString(),
        'X-Zip-Size': zipBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('❌ Error creating ZIP file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create source code archive',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { includeNodeModules = false, customFiles = [] } = await request.json()
    
    const projectRoot = process.cwd()
    let files = getAllFiles(projectRoot)
    
    // Filter files based on options
    if (!includeNodeModules) {
      files = files.filter(file => !file.path.includes('node_modules'))
    }
    
    // Add custom files if specified
    if (customFiles.length > 0) {
      const additionalFiles = customFiles
        .filter((filePath: string) => existsSync(join(projectRoot, filePath)) && !shouldExclude(filePath))
        .map((filePath: string) => {
          const stats = statSync(join(projectRoot, filePath))
          return {
            path: filePath,
            name: filePath.split('/').pop() || filePath,
            isDirectory: stats.isDirectory(),
            size: stats.size
          }
        })
      files.push(...additionalFiles)
    }

    // Filter to only include files (not directories)
    const fileFiles = files.filter(file => !file.isDirectory)

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 6 }
    })

    // Set up error handling
    archive.on('error', (err) => {
      console.error('Archive error:', err)
      throw err
    })

    // Create a buffer to store the ZIP data
    const chunks: Buffer[] = []
    
    archive.on('data', (chunk) => {
      chunks.push(chunk)
    })

    // Add files to archive
    for (const file of fileFiles) {
      const fullPath = join(projectRoot, file.path)
      try {
        archive.file(fullPath, { name: file.path })
      } catch (error) {
        console.warn(`Could not add file ${file.path} to archive:`, error)
      }
    }

    // Finalize the archive and wait for completion
    await new Promise<void>((resolve, reject) => {
      archive.on('end', () => resolve())
      archive.on('error', reject)
      archive.finalize()
    })

    // Combine all chunks into a single buffer
    const zipBuffer = Buffer.concat(chunks)

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const projectName = 'arabic-tech-news-summarizer'
    const suffix = includeNodeModules ? '-full' : '-source'
    const filename = `${projectName}${suffix}-${timestamp}.zip`

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Files-Count': fileFiles.length.toString(),
        'X-Include-Node-Modules': includeNodeModules.toString(),
        'X-Zip-Size': zipBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('Error creating custom ZIP file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create custom source code archive',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}