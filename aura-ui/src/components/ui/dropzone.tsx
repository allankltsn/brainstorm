"use client"

import * as React from "react"
import { UploadCloudIcon, FileIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Dropzone({
  className,
  onFilesChange,
  accept,
  multiple = true,
  disabled = false,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  onFilesChange?: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [files, setFiles] = React.useState<File[]>([])

  function commit(next: File[]) {
    setFiles(next)
    onFilesChange?.(next)
  }

  function addFiles(incoming: File[]) {
    if (!incoming.length) return
    const next = multiple ? [...files, ...incoming] : incoming.slice(0, 1)
    commit(next)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files ?? []))
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    addFiles(Array.from(e.dataTransfer.files ?? []))
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (disabled) return
    setDragging(true)
  }

  function removeFile(index: number) {
    commit(files.filter((_, i) => i !== index))
  }

  return (
    <div data-slot="dropzone" className={cn("flex flex-col gap-3", className)} {...props}>
      <div
        data-slot="dropzone-area"
        data-dragging={dragging}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8 text-center transition-colors outline-none hover:bg-muted/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          dragging && "border-primary bg-muted/50",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-5">
          <UploadCloudIcon />
        </div>
        <p className="font-heading text-base font-medium">Arraste arquivos aqui</p>
        <p className="text-sm text-muted-foreground">ou clique para selecionar</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="hidden"
          data-slot="dropzone-input"
        />
      </div>

      {files.length > 0 && (
        <ul data-slot="dropzone-list" className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              data-slot="dropzone-item"
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm"
            >
              <FileIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remover ${file.name}`}
                onClick={() => removeFile(index)}
                className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-3.5"
              >
                <XIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export { Dropzone }
