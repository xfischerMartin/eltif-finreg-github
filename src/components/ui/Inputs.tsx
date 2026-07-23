import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

/** Tailwind Plus–style inset ring controls */
const inputClassName =
  'block w-full min-h-10 rounded-md bg-paper px-3 py-2 text-sm text-ink shadow-none ring-1 ring-inset ring-gray-300 placeholder:text-ink-muted/55 transition-[box-shadow,ring-color] duration-150 ease-out hover:ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent'

type TextInputProps = InputHTMLAttributes<HTMLInputElement>

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${inputClassName} ${className}`.trim()}
        {...props}
      />
    )
  },
)

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value: number | null
  onChange: (value: number | null) => void
  suffix?: string
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    { className = '', value, onChange, suffix, onBlur, onWheel, ...props },
    ref,
  ) {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="number"
          inputMode="decimal"
          className={`${inputClassName} ${suffix ? 'pr-14' : ''} ${className}`.trim()}
          value={value ?? ''}
          onChange={(e) => {
            const raw = e.target.value
            if (raw === '') {
              onChange(null)
              return
            }
            const parsed = Number(raw)
            onChange(Number.isNaN(parsed) ? null : parsed)
          }}
          onBlur={onBlur}
          {...props}
          onWheel={(e) => {
            e.currentTarget.blur()
            onWheel?.(e)
          }}
        />
        {suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium text-ink-muted">
            {suffix}
          </span>
        ) : null}
      </div>
    )
  },
)

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ className = '', ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={4}
        className={`${inputClassName} min-h-28 resize-y ${className}`.trim()}
        {...props}
      />
    )
  },
)

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<{ value: string; label: string }>
  placeholder?: string
  onValueChange?: (value: string) => void
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  function SelectInput(
    { className = '', options, placeholder, onChange, onValueChange, ...props },
    ref,
  ) {
    return (
      <select
        ref={ref}
        className={`${inputClassName} cursor-pointer ${className}`.trim()}
        {...props}
        onChange={(e) => {
          onChange?.(e)
          onValueChange?.(e.target.value)
        }}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  },
)

type RadioOption = { value: string; label: string }

type RadioGroupProps = {
  name: string
  value: string
  options: RadioOption[]
  onChange: (value: string) => void
  onBlur?: () => void
  layout?: 'wrap' | 'stack'
}

export function RadioGroup({
  name,
  value,
  options,
  onChange,
  onBlur,
  layout = 'wrap',
}: RadioGroupProps) {
  return (
    <div
      className={
        layout === 'stack'
          ? 'flex flex-col gap-2'
          : 'flex flex-col gap-2 sm:flex-row sm:flex-wrap'
      }
      role="radiogroup"
      aria-labelledby={name}
    >
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const selected = value === opt.value
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-[background-color,box-shadow,color] duration-150 ease-out ${
              selected
                ? 'bg-accent/5 text-ink ring-2 ring-accent'
                : 'bg-paper text-ink-muted ring-1 ring-inset ring-gray-300 hover:ring-gray-400'
            }`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              onBlur={onBlur}
              className="h-4 w-4 shrink-0 cursor-pointer"
              style={{ accentColor: '#2563eb' }}
            />
            <span className="min-w-0 flex-1 text-left leading-snug">
              {opt.label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

type CheckboxOption = { value: string; label: string }

type CheckboxGroupProps = {
  name: string
  values: string[]
  options: CheckboxOption[]
  onChange: (values: string[]) => void
  onBlur?: () => void
}

export function CheckboxGroup({
  name,
  values,
  options,
  onChange,
  onBlur,
}: CheckboxGroupProps) {
  const toggle = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue))
    } else {
      onChange([...values, optionValue])
    }
  }

  return (
    <div className="flex flex-col gap-2" role="group" aria-labelledby={name}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const checked = values.includes(opt.value)
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`inline-flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-[background-color,box-shadow,color] duration-150 ease-out ${
              checked
                ? 'bg-accent/5 text-ink ring-2 ring-accent'
                : 'bg-paper text-ink-muted ring-1 ring-inset ring-gray-300 hover:ring-gray-400'
            }`}
          >
            <input
              id={id}
              type="checkbox"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => toggle(opt.value)}
              onBlur={onBlur}
              className="h-4 w-4 shrink-0 cursor-pointer"
              style={{ accentColor: '#2563eb' }}
            />
            {opt.label}
          </label>
        )
      })}
    </div>
  )
}
