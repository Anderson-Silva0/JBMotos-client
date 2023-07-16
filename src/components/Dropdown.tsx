import { useRef, ReactNode, useState, useEffect, Dispatch } from 'react'

interface DropdownProps {
  titulo: string
  children: ReactNode
  componenteClicado: string
  setComponenteClicado: Dispatch<React.SetStateAction<string>>
}

export default function Dropdown({
  titulo,
  children,
  componenteClicado,
  setComponenteClicado
}: DropdownProps) {

  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleClickContent = () => {
    if (contentRef.current) {
      const dropdownContent = contentRef.current.style
      const computedDisplay = window.getComputedStyle(contentRef.current).display

      if (computedDisplay === 'none' && !isOpen && componenteClicado === '') {
        dropdownContent.display = 'flex'
        dropdownContent.flexDirection = 'column'
        dropdownContent.padding = '20px'
        dropdownContent.position = 'absolute'
        dropdownContent.zIndex = '9999'
        setIsOpen(true)
        setComponenteClicado(titulo)
      } else if (isOpen && titulo === componenteClicado) {
        dropdownContent.display = 'none'
        setIsOpen(false)
        setComponenteClicado('')
      }
    }
  }

  const handleClickAnywhere = (event: any) => {
    if (
      contentRef.current &&
      !contentRef.current.contains(event.target as Node) &&
      isOpen &&
      titulo === componenteClicado
    ) {
      contentRef.current.style.display = 'none'
      setIsOpen(false)
      setComponenteClicado('')
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickAnywhere)

    return () => {
      document.removeEventListener('click', handleClickAnywhere)
    }
  }, [isOpen])

  useEffect(() => {
    return () => {
      document.removeEventListener('click', handleClickAnywhere)
    }
  }, [])

  return (
    <div onClick={handleClickContent} className="dropdown">
      <span className='dropdown-titulo'>{titulo}</span>
      <div className="dropdown-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}