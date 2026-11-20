import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar', () => {
  it('renderiza o fallback com slot', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )
    const fallback = screen.getByText('AB')
    expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback')
  })
})
