import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, preferences } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'صيغة البريد الإلكتروني غير صحيحة' },
        { status: 400 }
      )
    }

    // Check if user already exists
    let userPreferences = await db.userPreferences.findFirst({
      where: { email }
    })

    if (userPreferences) {
      // Update existing user preferences
      userPreferences = await db.userPreferences.update({
        where: { id: userPreferences.id },
        data: {
          preferredLang: preferences?.preferredLang || 'ar',
          categories: preferences?.categories ? JSON.stringify(preferences.categories) : null,
          tags: preferences?.tags ? JSON.stringify(preferences.tags) : null,
          sources: preferences?.sources ? JSON.stringify(preferences.sources) : null,
          topics: preferences?.topics ? JSON.stringify(preferences.topics) : null,
          frequency: preferences?.frequency || 'daily',
          isActive: preferences?.isActive !== false,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new user preferences
      userPreferences = await db.userPreferences.create({
        data: {
          email,
          preferredLang: preferences?.preferredLang || 'ar',
          categories: preferences?.categories ? JSON.stringify(preferences.categories) : null,
          tags: preferences?.tags ? JSON.stringify(preferences.tags) : null,
          sources: preferences?.sources ? JSON.stringify(preferences.sources) : null,
          topics: preferences?.topics ? JSON.stringify(preferences.topics) : null,
          frequency: preferences?.frequency || 'daily',
          isActive: preferences?.isActive !== false
        }
      })
    }

    // Handle topic subscriptions
    if (preferences?.topics && preferences.topics.length > 0) {
      // Remove existing topic subscriptions
      await db.topicSubscription.deleteMany({
        where: { userId: userPreferences.id }
      })

      // Add new topic subscriptions
      for (const topicName of preferences.topics) {
        // Find or create topic
        let topic = await db.topic.findFirst({
          where: { name: topicName }
        })

        if (!topic) {
          topic = await db.topic.create({
            data: {
              name: topicName,
              description: `موضوع مخصص للمشترك: ${email}`,
              keywords: JSON.stringify([topicName])
            }
          })
        }

        // Create subscription
        await db.topicSubscription.create({
          data: {
            userId: userPreferences.id,
            topicId: topic.id
          }
        })
      }
    }

    return NextResponse.json({
      message: 'تم الاشتراك بنجاح',
      user: {
        id: userPreferences.id,
        email: userPreferences.email,
        preferences: {
          preferredLang: userPreferences.preferredLang,
          categories: userPreferences.categories ? JSON.parse(userPreferences.categories) : [],
          tags: userPreferences.tags ? JSON.parse(userPreferences.tags) : [],
          sources: userPreferences.sources ? JSON.parse(userPreferences.sources) : [],
          topics: userPreferences.topics ? JSON.parse(userPreferences.topics) : [],
          frequency: userPreferences.frequency,
          isActive: userPreferences.isActive
        }
      }
    })
  } catch (error) {
    console.error('Error in subscription:', error)
    return NextResponse.json(
      { error: 'فشل في الاشتراك' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const userPreferences = await db.userPreferences.findFirst({
      where: { email },
      include: {
        subscriptions: {
          include: {
            topic: true
          }
        }
      }
    })

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: userPreferences.id,
        email: userPreferences.email,
        preferences: {
          preferredLang: userPreferences.preferredLang,
          categories: userPreferences.categories ? JSON.parse(userPreferences.categories) : [],
          tags: userPreferences.tags ? JSON.parse(userPreferences.tags) : [],
          sources: userPreferences.sources ? JSON.parse(userPreferences.sources) : [],
          topics: userPreferences.subscriptions.map(sub => sub.topic.name),
          frequency: userPreferences.frequency,
          isActive: userPreferences.isActive,
          lastSentAt: userPreferences.lastSentAt
        }
      }
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'فشل في جلب الاشتراك' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      )
    }

    const userPreferences = await db.userPreferences.findFirst({
      where: { email }
    })

    if (!userPreferences) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      )
    }

    // Delete topic subscriptions
    await db.topicSubscription.deleteMany({
      where: { userId: userPreferences.id }
    })

    // Delete user preferences
    await db.userPreferences.delete({
      where: { id: userPreferences.id }
    })

    return NextResponse.json({
      message: 'تم إلغاء الاشتراك بنجاح'
    })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json(
      { error: 'فشل في إلغاء الاشتراك' },
      { status: 500 }
    )
  }
}