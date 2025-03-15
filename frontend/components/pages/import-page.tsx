"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Download } from "lucide-react"
import { Label } from "@/components/ui/label"

export function ImportPage() {
  const [itemsFile, setItemsFile] = useState<File | null>(null)
  const [containersFile, setContainersFile] = useState<File | null>(null)
  const [itemsResult, setItemsResult] = useState<any>(null)
  const [containersResult, setContainersResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function handleItemsUpload() {
    if (!itemsFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", itemsFile)

      const response = await fetch("/api/import/items", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setItemsResult(result)
    } catch (error) {
      console.error("Error uploading items file:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleContainersUpload() {
    if (!containersFile) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", containersFile)

      const response = await fetch("/api/import/containers", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setContainersResult(result)
    } catch (error) {
      console.error("Error uploading containers file:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleExportArrangement() {
    setLoading(true)
    try {
      const response = await fetch("/api/export/arrangement")

      if (response.ok) {
        // Create a download link for the CSV file
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "arrangement.csv"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
      }
    } catch (error) {
      console.error("Error exporting arrangement:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">Import/Export Data</h2>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="import" className="tektur">
            Import
          </TabsTrigger>
          <TabsTrigger value="export" className="tektur">
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="import">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="tektur text-white/90">Import Items</CardTitle>
                <CardDescription className="tektur text-white/70">Upload a CSV file with item data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="items-file" className="tektur text-white/80">
                      Items CSV File
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="items-file"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => setItemsFile(e.target.files?.[0] || null)}
                      />
                      <Button
                        variant="outline"
                        className="tektur border-white/20 bg-black/20 text-white"
                        onClick={() => document.getElementById("items-file")?.click()}
                      >
                        Choose File
                      </Button>
                      <span className="tektur text-white/70 text-sm truncate">
                        {itemsFile ? itemsFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleItemsUpload}
                    className="w-full tektur bg-blue-700 hover:bg-blue-600"
                    disabled={!itemsFile || loading}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {loading ? "Uploading..." : "Upload Items"}
                  </Button>

                  {itemsResult && (
                    <div className="mt-4">
                      <Card className="bg-black/20 border-white/10">
                        <CardContent className="p-4">
                          <div className="tektur text-sm">
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${itemsResult.success ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              <div className="text-white">
                                {itemsResult.success
                                  ? `Successfully imported ${itemsResult.itemsImported} items`
                                  : "Failed to import items"}
                              </div>
                            </div>

                            {itemsResult.errors && itemsResult.errors.length > 0 && (
                              <div className="mt-2">
                                <h3 className="text-white/90 mb-1">Errors:</h3>
                                <div className="space-y-1">
                                  {itemsResult.errors.map((error: any, index: number) => (
                                    <div key={index} className="text-red-400">
                                      Row {error.row}: {error.message}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="tektur text-white/90">Import Containers</CardTitle>
                <CardDescription className="tektur text-white/70">
                  Upload a CSV file with container data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="containers-file" className="tektur text-white/80">
                      Containers CSV File
                    </Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="containers-file"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => setContainersFile(e.target.files?.[0] || null)}
                      />
                      <Button
                        variant="outline"
                        className="tektur border-white/20 bg-black/20 text-white"
                        onClick={() => document.getElementById("containers-file")?.click()}
                      >
                        Choose File
                      </Button>
                      <span className="tektur text-white/70 text-sm truncate">
                        {containersFile ? containersFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleContainersUpload}
                    className="w-full tektur bg-blue-700 hover:bg-blue-600"
                    disabled={!containersFile || loading}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {loading ? "Uploading..." : "Upload Containers"}
                  </Button>

                  {containersResult && (
                    <div className="mt-4">
                      <Card className="bg-black/20 border-white/10">
                        <CardContent className="p-4">
                          <div className="tektur text-sm">
                            <div className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${containersResult.success ? "bg-green-500" : "bg-red-500"}`}
                              ></div>
                              <div className="text-white">
                                {containersResult.success
                                  ? `Successfully imported ${containersResult.containersImported} containers`
                                  : "Failed to import containers"}
                              </div>
                            </div>

                            {containersResult.errors && containersResult.errors.length > 0 && (
                              <div className="mt-2">
                                <h3 className="text-white/90 mb-1">Errors:</h3>
                                <div className="space-y-1">
                                  {containersResult.errors.map((error: any, index: number) => (
                                    <div key={index} className="text-red-400">
                                      Row {error.row}: {error.message}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Export Current Arrangement</CardTitle>
              <CardDescription className="tektur text-white/70">
                Download a CSV file with the current arrangement data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportArrangement}
                className="w-full tektur bg-blue-700 hover:bg-blue-600"
                disabled={loading}
              >
                <Download className="mr-2 h-4 w-4" />
                {loading ? "Exporting..." : "Export Arrangement"}
              </Button>

              <div className="mt-4 p-4 bg-black/20 rounded border border-white/10">
                <h3 className="tektur text-white/90 text-sm mb-2">CSV Format:</h3>
                <pre className="tektur text-white/70 text-xs overflow-x-auto">
                  Item ID,Container ID,Coordinates (W1,D1,H1),(W2,D2,H2){"\n"}
                  001,contA,(0,0,0),(10,10,20){"\n"}
                  002,contB,(0,0,0),(15,15,50)
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

