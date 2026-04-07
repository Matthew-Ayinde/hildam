"use client"

import { useMemo, useRef, useState } from "react"
import { HiOutlinePhotograph, HiOutlineUpload } from "react-icons/hi"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  files: File[]
  onChange: (files: File[]) => void
  error?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

export default function ImageUploader({ files, onChange, error }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const fileNames = useMemo(() => files.map((file) => file.name), [files])

  const normalizeFiles = (incoming: File[]) => {
    const unique = new Map<string, File>()

    incoming.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        unique.set(`${file.name}-${file.size}-${file.lastModified}`, file)
      }
    })

    return Array.from(unique.values())
  }

  const handleSelect = (incoming: FileList | null) => {
    if (!incoming) return
    const selected = normalizeFiles(Array.from(incoming))
    onChange(selected)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700" htmlFor="ready-to-wear-image-upload">
        Product Images
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragActive(false)
          handleSelect(event.dataTransfer.files)
        }}
        className={`rounded-xl border-2 border-dashed p-6 text-center transition ${
          dragActive ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white">
          <HiOutlinePhotograph className="text-orange-500" size={24} />
        </div>
        <p className="text-sm text-gray-600">Drag and drop product images here</p>
        <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
          aria-label="Choose product images"
        >
          <HiOutlineUpload size={16} />
          Choose Images
        </Button>

        <input
          id="ready-to-wear-image-upload"
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => handleSelect(event.target.files)}
          aria-invalid={Boolean(error)}
        />
      </div>

      {fileNames.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Selected Files</p>
          <ul className="space-y-1 text-sm text-gray-700">
            {fileNames.map((name) => (
              <li key={name} className="truncate">{name}</li>
            ))}
          </ul>
        </div>
      )}

      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
