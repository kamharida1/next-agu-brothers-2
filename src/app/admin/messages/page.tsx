import AdminLayout from '@/components/admin/AdminLayout'
import Messages from './Messages'


export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Messages',}

const AdminMessagesPage = () => {
  return (
    <AdminLayout activeItem="messages">
     <Messages />
    </AdminLayout>
  )
}
export default AdminMessagesPage
