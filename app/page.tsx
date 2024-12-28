import { auth } from './lib/auth'
import TaskList from './components/tasks/TaskList'

export default async function Home() {
  const session = await auth()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <div className="text-gray-600">
          Welcome, {session?.user?.name}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-6">
        <TaskList />
      </div>
    </div>
  )
}