import React from 'react'

export default function Modal({
  children,
  onClose,
  closeOnBackdropClick = true,
}: {
  children: React.ReactNode
  onClose?: () => void
  closeOnBackdropClick?: boolean
}) {
  return (
    <div
      className='modal-overlay'
      role='dialog'
      aria-modal='true'
      onMouseDown={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div className='modal-panel'>
        {children}
      </div>
    </div>
  )
}
