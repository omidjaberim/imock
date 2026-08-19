import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ScrollLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
     targetId: string
     children: ReactNode
}

export function ScrollLink({ targetId, children, onClick, ...props }: ScrollLinkProps) {
     return (
          <Link
               to='/'
               {...props}
               onClick={(event) => {
                    event.preventDefault()
                    onClick?.(event)
                    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
               }}
          >
               {children}
          </Link>
     )
}
