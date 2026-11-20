import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'

describe('input-otp aura-ui', () => {
  it('monta o input com os slots', () => {
    const { container } = render(
      <InputOTP maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>,
    )
    expect(container.querySelector('[data-slot="input-otp"]')).toBeInTheDocument()
    expect(container.querySelector('input')).toBeInTheDocument()
  })
})
