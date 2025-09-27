'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  AcademicCapIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'

interface Assignment {
  id: string
  title: string
  description: string
  course: string
  instructor: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: number
  maxGrade: number
  submissionType: 'file' | 'text' | 'both'
  attachments?: string[]
}

// Dummy assignment data
const dummyAssignments: Assignment[] = [
  {
    id: '1',
    title: 'React Component Library',
    description: 'Create a reusable component library with at least 5 components including Button, Input, Modal, Card, and Form.',
    course: 'React Fundamentals',
    instructor: 'John Doe',
    dueDate: '2024-01-20T23:59:00',
    status: 'pending',
    maxGrade: 100,
    submissionType: 'file',
    attachments: ['assignment-1.pdf']
  },
  {
    id: '2',
    title: 'Node.js API Project',
    description: 'Build a RESTful API with Express.js that includes CRUD operations for a blog system.',
    course: 'Node.js Backend Development',
    instructor: 'Jane Smith',
    dueDate: '2024-01-18T23:59:00',
    status: 'submitted',
    maxGrade: 100,
    submissionType: 'both'
  },
  {
    id: '3',
    title: 'JavaScript Algorithms',
    description: 'Solve 10 algorithm problems and explain your approach for each solution.',
    course: 'Advanced JavaScript',
    instructor: 'Mike Johnson',
    dueDate: '2024-01-15T23:59:00',
    status: 'graded',
    grade: 85,
    maxGrade: 100,
    submissionType: 'text'
  },
  {
    id: '4',
    title: 'Database Design Project',
    description: 'Design a database schema for an e-commerce platform with proper relationships and constraints.',
    course: 'Database Management',
    instructor: 'Sarah Wilson',
    dueDate: '2024-01-12T23:59:00',
    status: 'overdue',
    maxGrade: 100,
    submissionType: 'file'
  }
]

export default function StudentAssignmentsPage() {
  const [assignments] = useState<Assignment[]>(dummyAssignments)
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded' | 'overdue'>('all')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'submitted':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'graded':
        return <AcademicCapIcon className="h-4 w-4" />
      case 'overdue':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const filteredAssignments = filter === 'all' 
    ? assignments 
    : assignments.filter(assignment => assignment.status === filter)

  const handleSubmitAssignment = (assignment: Assignment) => {
    console.log('Submitting assignment:', assignment.title)
    // Here you would open a submission modal or navigate to submission page
  }

  const handleViewSubmission = (assignment: Assignment) => {
    console.log('Viewing submission for:', assignment.title)
    // Here you would show the submitted work
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600">Track your assignments and submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'submitted', label: 'Submitted' },
          { key: 'graded', label: 'Graded' },
          { key: 'overdue', label: 'Overdue' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full border ${getStatusBadge(assignment.status)}`}>
                    {getStatusIcon(assignment.status)}
                    <span className="ml-1">{assignment.status.toUpperCase()}</span>
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-4 w-4 mr-2" />
                    {assignment.course}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Due: {formatDateTime(assignment.dueDate)}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Max Grade:</span>
                    <span className="font-medium">{assignment.maxGrade}</span>
                  </div>
                </div>

                {assignment.attachments && assignment.attachments.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <PaperClipIcon className="h-4 w-4 mr-2" />
                      Attachments: {assignment.attachments.join(', ')}
                    </div>
                  </div>
                )}

                {assignment.grade !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 mr-2">Grade:</span>
                      <span className={`font-medium ${assignment.grade >= 80 ? 'text-green-600' : assignment.grade >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {assignment.grade}/{assignment.maxGrade}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="ml-6 flex flex-col space-y-2">
                {assignment.status === 'pending' && (
                  <Button 
                    onClick={() => handleSubmitAssignment(assignment)}
                    variant={isOverdue(assignment.dueDate) ? "destructive" : "default"}
                  >
                    {isOverdue(assignment.dueDate) ? 'Submit Late' : 'Submit'}
                  </Button>
                )}
                
                {assignment.status === 'submitted' && (
                  <Button 
                    onClick={() => handleViewSubmission(assignment)}
                    variant="outline"
                  >
                    View Submission
                  </Button>
                )}
                
                {assignment.status === 'graded' && (
                  <Button 
                    onClick={() => handleViewSubmission(assignment)}
                    variant="outline"
                  >
                    View Feedback
                  </Button>
                )}
                
                {assignment.status === 'overdue' && (
                  <Button 
                    onClick={() => handleSubmitAssignment(assignment)}
                    variant="destructive"
                  >
                    Submit Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'submitted').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Graded</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'graded').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'overdue').length}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
