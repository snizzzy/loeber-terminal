src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import LoeberTerminal from './LoeberTerminal.jsx'

// Polyfill window.storage with localStorage so the terminal's persistence works in production
if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    get: async (key) => {
      try {
        const value = localStorage.getItem(key)
        if (value === null) return null
        return { key, value, shared: false }
      } catch (e) { return null }
    },
    set: async (key, value, shared = false) => {
      try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
        return { key, value, shared }
      } catch (e) { return null }
    },
    delete: async (key) => {
      try {
        localStorage.removeItem(key)
        return { key, deleted: true, shared: false }
      } catch (e) { return null }
    },
    list: async (prefix = '') => {
      try {
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i)
          if (k && k.startsWith(prefix)) keys.push(k)
        }
        return { keys, prefix, shared: false }
      } catch (e) { return null }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LoeberTerminal />
  </React.StrictMode>
)
