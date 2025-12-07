'use client';

import { useState, useId } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  textarea?: boolean;
  rows?: number;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  onBlur,
  textarea = false,
  rows = 4,
}: FormFieldProps) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  const Component = textarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-2 transition-colors ${
          error ? 'text-red-400' : isFocused ? 'text-amber-400' : 'text-neutral-400'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <Component
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        rows={textarea ? rows : undefined}
        className={`input-vercel w-full ${
          error ? 'border-red-500/50' : ''
        } ${hasValue && !error ? 'border-green-500/30' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="error-message mt-2 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {hasValue && !error && required && (
        <p className="success-message mt-2 flex items-center gap-1 text-green-400 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Looks good!
        </p>
      )}
    </div>
  );
}

