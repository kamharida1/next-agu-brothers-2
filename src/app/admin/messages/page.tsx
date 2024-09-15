import AdminLayout from '@/components/admin/AdminLayout'
import Messages from './Messages'


export const metadata = {
  title: 'Admin Messages',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}

const AdminMessagesPage = () => {
  return (
    <AdminLayout activeItem="messages">
     <Messages />
    </AdminLayout>
  )
}
export default AdminMessagesPage
