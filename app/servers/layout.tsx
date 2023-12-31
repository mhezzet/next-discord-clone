import NavigationSidebar from '@/components/navigation/navigation-sidebar'

interface IMainLayout {
  children: React.ReactNode
}

const MainLayout: React.FC<IMainLayout> = ({ children }) => {
  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <NavigationSidebar />
      </div>
      <main className='h-full max-h-screen md:pl-[72px]'>{children}</main>
    </div>
  )
}

export default MainLayout
