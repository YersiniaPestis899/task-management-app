import { auth } from './lib/auth'
import { redirect } from 'next/navigation'
import TaskList from './components/tasks/TaskList'

export default async function Home() {
  const session = await auth()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <div className="text-gray-600">
          Welcome, {session.user.name}
        </div>
      </div>
      <TaskList />
    </div>
  )
}