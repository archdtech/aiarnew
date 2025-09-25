import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const action = searchParams.get('action')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (date) {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)
      
      where.createdAt = {
        gte: startDate,
        lte: endDate
      }
    }

    if (action) {
      where.action = action
    }

    if (status) {
      where.status = status
    }

    // Get logs
    const logs = await db.processingLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count
    const total = await db.processingLog.count({ where })

    // Get statistics
    const stats = await db.processingLog.groupBy({
      by: ['action', 'status'],
      where: date ? {
        createdAt: {
          gte: new Date(date + 'T00:00:00.000Z'),
          lte: new Date(date + 'T23:59:59.999Z')
        }
      } : {},
      _count: {
        action: true
      }
    })

    // Transform statistics
    const transformedStats: any = {}
    stats.forEach(stat => {
      const key = `${stat.action}_${stat.status}`
      transformedStats[key] = stat._count.action
    })

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        action: log.action,
        status: log.status,
        message: log.message,
        metadata: log.metadata ? JSON.parse(log.metadata) : null,
        createdAt: log.createdAt.toISOString()
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      statistics: transformedStats,
      summary: {
        total,
        success: logs.filter(log => log.status === 'success').length,
        error: logs.filter(log => log.status === 'error').length,
        pending: logs.filter(log => log.status === 'pending').length
      }
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: 'فشل في جلب السجلات' },
      { status: 500 }
    )
  }
}