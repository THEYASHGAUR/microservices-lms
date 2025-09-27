'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  BellIcon,
  CircleStackIcon,
  CloudArrowUpIcon,
  KeyIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  backupFrequency: string
  sslEnabled: boolean
  apiRateLimit: number
}

export default function AdminSystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'storage' | 'api'>('general')
  
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'LMS Platform',
    siteDescription: 'Learning Management System',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxFileSize: 100,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png', 'mp4'],
    backupFrequency: 'daily',
    sslEnabled: true,
    apiRateLimit: 1000
  })

  const handleSaveSettings = () => {
    console.log('Saving system settings:', settings)
    alert('System settings saved successfully!')
  }

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      console.log('Resetting settings...')
      alert('Settings reset to default values!')
    }
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'storage', name: 'Storage', icon: CircleStackIcon },
    { id: 'api', name: 'API', icon: CloudArrowUpIcon }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings and preferences</p>
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
          {activeTab === 'general' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      placeholder="Enter site name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <Input
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      placeholder="Enter site description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                      <p className="text-sm text-gray-500">Enable maintenance mode to restrict access</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">User Registration</h3>
                      <p className="text-sm text-gray-500">Allow new users to register</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.registrationEnabled}
                      onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SSL/TLS Encryption</h3>
                      <p className="text-sm text-gray-500">Enable secure connections</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sslEnabled}
                      onChange={(e) => setSettings({...settings, sslEnabled: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Rate Limit (requests per hour)
                    </label>
                    <Input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Security Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full md:w-auto">
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Regenerate API Keys
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <ShieldCheckIcon className="h-4 w-4 mr-2" />
                      Run Security Scan
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Send email notifications to users</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Notification Templates</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full md:w-auto">
                      <BellIcon className="h-4 w-4 mr-2" />
                      Configure Email Templates
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Test Notifications
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'storage' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Storage Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed File Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {settings.allowedFileTypes.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Storage Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full md:w-auto">
                      <CircleStackIcon className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <ServerIcon className="h-4 w-4 mr-2" />
                      Clean Temporary Files
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">API Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Rate Limit (requests per hour)
                  </label>
                  <Input
                    type="number"
                    value={settings.apiRateLimit}
                    onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                    placeholder="1000"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">API Management</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full md:w-auto">
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      View API Documentation
                    </Button>
                    <Button variant="outline" className="w-full md:w-auto">
                      <KeyIcon className="h-4 w-4 mr-2" />
                      Manage API Keys
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Save/Reset Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleResetSettings}>
              Reset to Default
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
