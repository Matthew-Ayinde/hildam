"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import { importCustomerData } from "@/app/api/apiClient" // Assuming this is where your API call lives

const REQUIRED_CSV_HEADERS = ["name", "gender", "phone_number", "address", "date_of_birth"]

interface ImportCustomerDataModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ImportCustomerDataModal({ isOpen, onClose, onSuccess }: ImportCustomerDataModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const validateCsvHeaders = async (file: File): Promise<string | null> => {
    const csvText = await file.text()
    const [headerLine] = csvText.split(/\r?\n/)

    if (!headerLine) {
      return "The CSV file is empty."
    }

    const parsedHeaders = headerLine
      .split(",")
      .map((header) => header.trim().replace(/^"|"$/g, ""))

    const missingHeaders = REQUIRED_CSV_HEADERS.filter((header) => !parsedHeaders.includes(header))
    if (missingHeaders.length > 0) {
      return `Invalid CSV headers. Missing: ${missingHeaders.join(", ")}. Use date_of_birth (YYYY-MM-DD) instead of age.`
    }

    if (parsedHeaders.includes("age") && !parsedHeaders.includes("date_of_birth")) {
      return "Invalid CSV headers. Use date_of_birth (YYYY-MM-DD) instead of age."
    }

    return null
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
      setUploadError(null) // Clear previous errors
    } else {
      setSelectedFile(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.")
      return
    }

    if (selectedFile.name.toLowerCase().endsWith(".csv")) {
      const validationError = await validateCsvHeaders(selectedFile)
      if (validationError) {
        setUploadError(validationError)
        return
      }
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Call the API client function to upload the file
      const response = await importCustomerData(selectedFile)
      if (response.status === "success") {
        onSuccess() // Trigger data re-fetch in parent and close modal
      } else {
        setUploadError(response.message || "Failed to import data.")
      }

        window.location.reload() // Reload the page to reflect changes
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadError("An unexpected error occurred during upload.")
    } finally {
      setIsUploading(false)
      setSelectedFile(null) // Clear selected file after attempt
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Customer Data</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file containing customer information. Use `date_of_birth` in `YYYY-MM-DD`
            format (for example: `1996-04-15`) instead of `age`.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="data-file">Customer Data File</Label>
            <Input id="data-file" type="file" onChange={handleFileChange} accept=".csv, .xlsx" />
            <p className="text-xs text-muted-foreground">
              Required CSV headers include: name, gender, phone_number, address, date_of_birth.
            </p>
            {selectedFile && <p className="text-sm text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
            {uploadError && <p className="text-sm text-gray-500 mt-1">{uploadError}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
