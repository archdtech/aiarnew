import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isActive } = await request.json()

    const updatedSource = await db.newsSource.update({
      where: { id: params.id },
      data: { isActive }
    })

    return NextResponse.json({
      message: 'تم تحديث المصدر بنجاح',
      source: updatedSource
    })
  } catch (error) {
    console.error('Error updating source:', error)
    return NextResponse.json(
      { error: 'فشل في تحديث المصدر' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.newsSource.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'تم حذف المصدر بنجاح'
    })
  } catch (error) {
    console.error('Error deleting source:', error)
    return NextResponse.json(
      { error: 'فشل في حذف المصدر' },
      { status: 500 }
    )
  }
}