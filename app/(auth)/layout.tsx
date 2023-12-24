interface ILayout {
  children: React.ReactNode
}

const Layout: React.FC<ILayout> = ({ children }) => {
  return <div className='flex h-full items-center justify-center'>{children}</div>
}

export default Layout
