'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  VideoCameraIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  BellIcon
} from '@heroicons/react/24/outline'

interface LiveClass {
  id: string
  title: string
  instructor: string
  course: string
  startTime: string
  duration: string
  status: 'upcoming' | 'live' | 'ended'
  participants: number
  description: string
}

// Dummy live class data
const dummyLiveClasses: LiveClass[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    instructor: 'John Doe',
    course: 'React Fundamentals',
    startTime: '2024-01-15T10:00:00',
    duration: '2 hours',
    status: 'live',
    participants: 45,
    description: 'Learn advanced React hooks patterns and best practices'
  },
  {
    id: '2',
    title: 'Node.js API Development',
    instructor: 'Jane Smith',
    course: 'Node.js Backend Development',
    startTime: '2024-01-16T14:00:00',
    duration: '1.5 hours',
    status: 'upcoming',
    participants: 32,
    description: 'Building RESTful APIs with Express.js and MongoDB'
  },
  {
    id: '3',
    title: 'JavaScript ES6+ Features',
    instructor: 'Mike Johnson',
    course: 'Advanced JavaScript',
    startTime: '2024-01-14T16:00:00',
    duration: '1 hour',
    status: 'ended',
    participants: 28,
    description: 'Modern JavaScript features and syntax'
  }
]

export default function StudentLiveClassPage() {
  const [liveClasses] = useState<LiveClass[]>(dummyLiveClasses)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleJoinClass = (liveClass: LiveClass) => {
    if (liveClass.status === 'live') {
      console.log('Joining live class:', liveClass.title)
      // Here you would integrate with video conferencing service
    } else if (liveClass.status === 'upcoming') {
      console.log('Setting reminder for:', liveClass.title)
      // Here you would set a reminder
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Classes</h1>
        <p className="text-gray-600">Join live sessions and access recorded classes</p>
      </div>

      {/* Live Classes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {liveClasses.map((liveClass) => (
          <Card key={liveClass.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center relative">
              <VideoCameraIcon className="h-16 w-16 text-white" />
              {liveClass.status === 'live' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    LIVE
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-block text-xs px-2 py-1 rounded-full border ${getStatusBadge(liveClass.status)}`}>
                  {liveClass.status.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">{liveClass.course}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{liveClass.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{liveClass.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatDateTime(liveClass.startTime)}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {liveClass.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {liveClass.participants} participants
                </div>
              </div>
              
              <div className="flex space-x-2">
                {liveClass.status === 'live' && (
                  <Button 
                    onClick={() => handleJoinClass(liveClass)}
                    className="flex-1 bg-red-500 hover:bg-red-600"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                )}
                
                {liveClass.status === 'upcoming' && (
                  <Button 
                    onClick={() => handleJoinClass(liveClass)}
                    variant="outline"
                    className="flex-1"
                  >
                    <BellIcon className="h-4 w-4 mr-2" />
                    Set Reminder
                  </Button>
                )}
                
                {liveClass.status === 'ended' && (
                  <Button 
                    onClick={() => handleJoinClass(liveClass)}
                    variant="outline"
                    className="flex-1"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <VideoCameraIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Classes</p>
              <p className="text-2xl font-bold text-gray-900">
                {liveClasses.filter(c => c.status === 'live').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {liveClasses.filter(c => c.status === 'upcoming').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <PlayIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recordings</p>
              <p className="text-2xl font-bold text-gray-900">
                {liveClasses.filter(c => c.status === 'ended').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
