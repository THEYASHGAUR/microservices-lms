import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
