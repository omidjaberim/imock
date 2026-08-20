import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export type ToastProps = {
  message: string
  type?: ToastType
  onClose: () => void
}

export default function Toast({ message, type = 'info', onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose()
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  const tone =
    type === 'success'
      ? { bg: '#e7f7ef', color: '#14532d', border: '#a7ddbd' }
      : type === 'error'
        ? { bg: '#fff1f1', color: '#8b2d2d', border: '#f1c3c3' }
        : { bg: '#eef5ff', color: '#1d4f91', border: '#bfd3f0' }

  return (
    <div
      role='status'
      aria-live='polite'
      style={{
        position: 'fixed',
        right: 24,
        top: 24,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 360,
        padding: '12px 14px',
        borderRadius: 12,
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.color,
        boxShadow: '0 18px 42px rgba(23, 35, 61, 0.12)',
        fontSize: 14,
        fontWeight: 700,
      }}
    >
      <span aria-hidden='true' style={{ fontSize: 16 }}>
        {type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}
      </span>
      <span>{message}</span>
      <button
        type='button'
        aria-label='Dismiss notification'
        onClick={onClose}
        style={{
          marginLeft: 4,
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          opacity: 0.8,
        }}
      >
        ×
      </button>
    </div>
  )
}
