'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

interface UserSettings {
  name: string
  email: string
  phone: string
  bio: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  assignmentReminders: boolean
  liveClassReminders: boolean
  paymentNotifications: boolean
  chatNotifications: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private'
  showEmail: boolean
  showPhone: boolean
  allowMessages: boolean
}

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'security'>('profile')
  const [showPassword, setShowPassword] = useState(false)
  
  const [userSettings, setUserSettings] = useState<UserSettings>({
    name: 'John Student',
    email: 'john.student@example.com',
    phone: '+91 9876543210',
    bio: 'Passionate learner exploring new technologies',
    timezone: 'Asia/Kolkata',
    language: 'English'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    assignmentReminders: true,
    liveClassReminders: true,
    paymentNotifications: false,
    chatNotifications: true
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  })

  const handleSaveProfile = () => {
    console.log('Saving profile settings:', userSettings)
    alert('Profile settings saved successfully!')
  }

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', notificationSettings)
    alert('Notification settings saved successfully!')
  }

  const handleSavePrivacy = () => {
    console.log('Saving privacy settings:', privacySettings)
    alert('Privacy settings saved successfully!')
  }

  const handleChangePassword = () => {
    console.log('Changing password...')
    alert('Password change functionality coming soon!')
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: CogIcon }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={userSettings.timezone}
                      onChange={(e) => setUserSettings({...userSettings, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={userSettings.bio}
                    onChange={(e) => setUserSettings({...userSettings, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <Button onClick={handleSaveProfile} className="w-full md:w-auto">
                  Save Profile
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Assignment Reminders</h3>
                      <p className="text-sm text-gray-500">Get reminded about upcoming assignments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.assignmentReminders}
                      onChange={(e) => setNotificationSettings({...notificationSettings, assignmentReminders: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Live Class Reminders</h3>
                      <p className="text-sm text-gray-500">Get notified about upcoming live classes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.liveClassReminders}
                      onChange={(e) => setNotificationSettings({...notificationSettings, liveClassReminders: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Payment Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified about payment status</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.paymentNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, paymentNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Chat Notifications</h3>
                      <p className="text-sm text-gray-500">Get notified about new messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notificationSettings.chatNotifications}
                      onChange={(e) => setNotificationSettings({...notificationSettings, chatNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full md:w-auto">
                  Save Notification Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value as 'public' | 'private'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Show Email Address</h3>
                      <p className="text-sm text-gray-500">Allow others to see your email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showEmail}
                      onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Show Phone Number</h3>
                      <p className="text-sm text-gray-500">Allow others to see your phone number</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.showPhone}
                      onChange={(e) => setPrivacySettings({...privacySettings, showPhone: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Allow Messages</h3>
                      <p className="text-sm text-gray-500">Allow other students to message you</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacySettings.allowMessages}
                      onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <Button onClick={handleSavePrivacy} className="w-full md:w-auto">
                  Save Privacy Settings
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <Button onClick={handleChangePassword} variant="outline">
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ComputerDesktopIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-xs text-gray-500">Current session</p>
                        </div>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Active</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                          <p className="text-xs text-gray-500">Last active 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
