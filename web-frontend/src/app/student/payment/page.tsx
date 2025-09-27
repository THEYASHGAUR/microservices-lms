'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline'

interface Payment {
  id: string
  course: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  date: string
  transactionId?: string
  method: 'razorpay' | 'card' | 'upi'
}

interface Course {
  id: string
  title: string
  price: number
  description: string
  instructor: string
  isEnrolled: boolean
}

// Dummy payment data
const dummyPayments: Payment[] = [
  {
    id: '1',
    course: 'React Fundamentals',
    amount: 299,
    status: 'completed',
    date: '2024-01-10T10:30:00',
    transactionId: 'txn_123456789',
    method: 'razorpay'
  },
  {
    id: '2',
    course: 'Node.js Backend Development',
    amount: 349,
    status: 'pending',
    date: '2024-01-12T14:20:00',
    method: 'razorpay'
  },
  {
    id: '3',
    course: 'Advanced JavaScript',
    amount: 399,
    status: 'failed',
    date: '2024-01-08T16:45:00',
    method: 'card'
  }
]

// Dummy courses for payment
const dummyCourses: Course[] = [
  {
    id: '1',
    title: 'UI/UX Design Principles',
    price: 249,
    description: 'Learn modern design principles and user experience',
    instructor: 'Sarah Wilson',
    isEnrolled: false
  },
  {
    id: '2',
    title: 'Database Management',
    price: 199,
    description: 'Master database design and optimization',
    instructor: 'David Brown',
    isEnrolled: false
  }
]

export default function StudentPaymentPage() {
  const [payments] = useState<Payment[]>(dummyPayments)
  const [courses] = useState<Course[]>(dummyCourses)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'card' | 'upi'>('razorpay')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />
      case 'pending':
        return <ClockIcon className="h-4 w-4" />
      case 'failed':
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

  const handleRazorpayPayment = async (course: Course) => {
    try {
      // This is a mock implementation - in real app, you'd call your backend API
      const options = {
        key: 'rzp_test_1234567890', // Your Razorpay key
        amount: course.price * 100, // Amount in paise
        currency: 'INR',
        name: 'LMS Platform',
        description: `Payment for ${course.title}`,
        order_id: `order_${Date.now()}`, // This should come from your backend
        handler: function (response: any) {
          console.log('Payment successful:', response)
          alert('Payment successful!')
          // Here you would update the course enrollment status
        },
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#3B82F6'
        }
      }

      // Mock Razorpay integration
      console.log('Initiating Razorpay payment:', options)
      alert('Redirecting to Razorpay payment gateway...')
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const handlePayment = (course: Course) => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment(course)
    } else {
      alert(`${paymentMethod.toUpperCase()} payment integration coming soon!`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">Manage your course payments and transactions</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'pending').length}
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
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.status === 'failed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Courses for Payment */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                  <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₹{course.price}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => handlePayment(course)}
                className="w-full"
              >
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Pay with Razorpay
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BanknotesIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{payment.course}</h3>
                    <p className="text-sm text-gray-500">{formatDateTime(payment.date)}</p>
                    {payment.transactionId && (
                      <p className="text-xs text-gray-400">Txn ID: {payment.transactionId}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">₹{payment.amount}</span>
                    <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full border ${getStatusBadge(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{payment.status.toUpperCase()}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{payment.method}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Methods Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <CreditCardIcon className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Razorpay</p>
              <p className="text-sm text-gray-600">Cards, UPI, Net Banking</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <ReceiptPercentIcon className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">UPI</p>
              <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <BanknotesIcon className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Net Banking</p>
              <p className="text-sm text-gray-600">All major banks</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
