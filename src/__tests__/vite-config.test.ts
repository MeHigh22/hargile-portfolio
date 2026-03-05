import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe('Vite configuration', () => {
  const configContent = readFileSync(resolve(__dirname, '../../vite.config.ts'), 'utf-8')

  it('exports defineConfig with react and tailwindcss plugins', () => {
    expect(configContent).toContain("import react from '@vitejs/plugin-react'")
    expect(configContent).toContain("import tailwindcss from '@tailwindcss/vite'")
    expect(configContent).toContain('defineConfig')
    expect(configContent).toContain('react()')
    expect(configContent).toContain('tailwindcss()')
  })

  it('has test block with jsdom environment', () => {
    expect(configContent).toContain('test:')
    expect(configContent).toContain("environment: 'jsdom'")
  })
})
