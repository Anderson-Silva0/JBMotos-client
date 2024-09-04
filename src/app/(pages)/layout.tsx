import NavBar from '@/components/Navbar'

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavBar />
      <div className='div-principal'>
        {children}
      </div>
    </div>
  )
}
