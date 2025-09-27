import { DashboardLayout } from '@/components/dashboard/dashboard-layout'

export default function StudentLayout({
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
