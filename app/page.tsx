import { auth } from '@/app/lib/auth'
import { redirect } from 'next/navigation'
import TaskList from './components/tasks/TaskList'

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TaskList />
    </div>
  )
}