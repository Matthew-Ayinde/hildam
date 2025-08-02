"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Define the schema for the CSV headers based on your provided schema
const csvSchema = [
  { name: "name", type: "string" },
  { name: "email", type: "string" },
  { name: "phone_number", type: "string" },
  { name: "gender", type: "string" },
  { name: "address", type: "string" },
  { name: "age", type: "number" },
  { name: "customer_description", type: "string" },
  { name: "bust", type: "string" },
  { name: "waist", type: "string" },
  { name: "hip", type: "string" },
  { name: "shoulder", type: "string" },
  { name: "bustpoint", type: "string" },
  { name: "shoulder_to_underbust", type: "string" },
  { name: "round_under_bust", type: "string" },
  { name: "half_length", type: "string" },
  { name: "blouse_length", type: "string" },
  { name: "sleeve_length", type: "string" },
  { name: "round_sleeve", type: "string" },
  { name: "dress_length", type: "string" },
  { name: "chest", type: "string" },
  { name: "round_shoulder", type: "string" },
  { name: "skirt_length", type: "string" },
  { name: "trousers_length", type: "string" },
  { name: "round_thigh", type: "string" },
  { name: "round_knee", type: "string" },
  { name: "round_feet", type: "string" },
]

// Extract headers from the schema
const headers = csvSchema.map((field) => field.name)

// Based on your sample data, each full record has 29 fields (ID + 26 data fields + 2 timestamps)
const FIELDS_PER_RECORD = 29
// The data fields we want start at index 1 (skipping the ID)
const START_INDEX = 1
// The data fields we want end at index 26 (inclusive), which is START_INDEX + headers.length
const END_INDEX = START_INDEX + headers.length

/**
 * Escapes a field for CSV format.
 * Encloses the field in double quotes if it contains commas, double quotes, or newlines.
 * Doubles any existing double quotes within the field.
 */
function escapeCsvField(field: string | number | null | undefined): string {
  if (field === null || field === undefined) {
    return ""
  }
  let stringField = String(field)
  // Check if the field contains a comma, double quote, or newline
  if (stringField.includes(",") || stringField.includes('"') || stringField.includes("\n")) {
    // Escape double quotes by doubling them
    stringField = stringField.replace(/"/g, '""')
    // Enclose the field in double quotes
    return `"${stringField}"`
  }
  return stringField
}

export default function CsvExporter() {
  const [apiResponse, setApiResponse] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleExport = () => {
    setError(null) // Clear previous errors
    if (!apiResponse.trim()) {
      setError("Please paste your API response into the text area.")
      return
    }

    try {
      // Regex to extract all double-quoted fields
      // It handles escaped quotes within fields if they were present (e.g., "field with \"quote\"")
      const regex = /"((?:[^"\\]|\\.)*)"/g
      let match
      const allFields: string[] = []
      while ((match = regex.exec(apiResponse)) !== null) {
        allFields.push(match[1])
      }

      if (allFields.length === 0) {
        setError("No data found in the provided API response. Please check the format.")
        return
      }

      // Validate that the total number of fields is a multiple of FIELDS_PER_RECORD
      if (allFields.length % FIELDS_PER_RECORD !== 0) {
        setError(
          `The number of fields (${allFields.length}) is not a multiple of ${FIELDS_PER_RECORD} per record. Please check your API response format.`,
        )
        return
      }

      const records: (string | number)[][] = []
      // Iterate through all extracted fields, stepping by FIELDS_PER_RECORD to get each record
      for (let i = 0; i < allFields.length; i += FIELDS_PER_RECORD) {
        // Extract only the relevant data fields (skipping ID and timestamps)
        const recordFields = allFields.slice(i + START_INDEX, i + END_INDEX)
        records.push(recordFields)
      }

      // Format data into CSV rows
      const csvRows = [
        headers
          .map(escapeCsvField)
          .join(","), // Header row
        ...records.map((row) => row.map(escapeCsvField).join(",")), // Data rows
      ]

      const csvContent = csvRows.join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)

      // Create a temporary link element to trigger download
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "exported_data.csv") // Set the desired file name
      document.body.appendChild(link) // Append to body to make it clickable
      link.click() // Programmatically click the link to trigger download
      document.body.removeChild(link) // Clean up the temporary link
      URL.revokeObjectURL(url) // Release the object URL
    } catch (e) {
      console.error("Error generating CSV:", e)
      setError(
        "An unexpected error occurred while processing the data. Please ensure the API response format is correct.",
      )
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Export API Response to CSV</CardTitle>
          <CardDescription>Paste your API response below to convert it into a downloadable CSV file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-response">API Response</Label>
            <Textarea
              id="api-response"
              placeholder='Paste your API response here, e.g., "1","Matthew",...,"2025-07-31T13:25:12.000000Z""2","Oyinda Okpara",...'
              value={apiResponse}
              onChange={(e) => setApiResponse(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button onClick={handleExport} className="w-full">
            Export to CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
