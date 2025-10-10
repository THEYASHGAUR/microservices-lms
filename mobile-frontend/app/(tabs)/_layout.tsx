import { Tabs } from 'expo-router'
import { useAuthStore } from '@/stores/auth-store'
import { User, BookOpen, Settings, Users } from 'lucide-react-native'

export default function TabLayout() {
  const { user } = useAuthStore()

  if (!user) {
    return null
  }

  // Role-based tab configuration
  const getTabsForRole = (role: string) => {
    switch (role) {
      case 'student':
        return [
          {
            name: 'dashboard',
            title: 'Dashboard',
            icon: User,
            href: '/student/dashboard',
          },
          {
            name: 'courses',
            title: 'Courses',
            icon: BookOpen,
            href: '/student/courses',
          },
          {
            name: 'profile',
            title: 'Profile',
            icon: Settings,
            href: '/student/profile',
          },
        ]
      case 'instructor':
        return [
          {
            name: 'dashboard',
            title: 'Dashboard',
            icon: User,
            href: '/instructor/dashboard',
          },
          {
            name: 'courses',
            title: 'My Courses',
            icon: BookOpen,
            href: '/instructor/courses',
          },
          {
            name: 'students',
            title: 'Students',
            icon: Users,
            href: '/instructor/students',
          },
          {
            name: 'profile',
            title: 'Profile',
            icon: Settings,
            href: '/instructor/profile',
          },
        ]
      case 'admin':
        return [
          {
            name: 'dashboard',
            title: 'Dashboard',
            icon: User,
            href: '/admin/dashboard',
          },
          {
            name: 'users',
            title: 'Users',
            icon: Users,
            href: '/admin/users',
          },
          {
            name: 'courses',
            title: 'Courses',
            icon: BookOpen,
            href: '/admin/courses',
          },
          {
            name: 'settings',
            title: 'Settings',
            icon: Settings,
            href: '/admin/settings',
          },
        ]
      default:
        return []
    }
  }

  const tabs = getTabsForRole(user.role)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
