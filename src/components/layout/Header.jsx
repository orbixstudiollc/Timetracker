import { Menu, Bell, Settings } from 'lucide-react'
import { Avatar } from '../common/Avatar'
import { useApp } from '../../context/AppContext'

export function Header({ onMenuClick, title }) {
  const { state } = useApp()
  const currentUser = state.teamMembers[0] // First team member as current user

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-5 h-5 text-gray-500" />
          </button>
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
            {currentUser && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
                <Avatar
                  name={currentUser.name}
                  size="md"
                  showStatus
                  status={currentUser.status}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
