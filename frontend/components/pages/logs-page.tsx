"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

// Define the schema for the logs form
const logsFormSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  itemId: z.string().optional(),
  userId: z.string().optional(),
  actionType: z.string().optional(),
})

type LogsFormValues = z.infer<typeof logsFormSchema>

export function LogsPage() {
  const [logs, setLogs] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Initialize the form with default values
  const form = useForm<LogsFormValues>({
    resolver: zodResolver(logsFormSchema),
    defaultValues: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days ago
      endDate: new Date().toISOString().split("T")[0], // today
      itemId: "",
      userId: "",
      actionType: "",
    },
  })

  async function onSubmit(data: LogsFormValues) {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("startDate", new Date(data.startDate).toISOString())
      params.append("endDate", new Date(data.endDate).toISOString())
      if (data.itemId) params.append("itemId", data.itemId)
      if (data.userId) params.append("userId", data.userId)
      if (data.actionType) params.append("actionType", data.actionType)

      // Call the API
      const response = await fetch(`/api/logs?${params.toString()}`)
      const result = await response.json()
      setLogs(result)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">System Logs</h2>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="tektur text-white/90">Search Logs</CardTitle>
          <CardDescription className="tektur text-white/70">
            Filter logs by date, item, user, or action type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-black/20 border-white/20 tektur text-white" {...field} />
                      </FormControl>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">End Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-black/20 border-white/20 tektur text-white" {...field} />
                      </FormControl>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">Item ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter item ID"
                          className="bg-black/20 border-white/20 tektur text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">User ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter user ID"
                          className="bg-black/20 border-white/20 tektur text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">Action Type (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-white/20 tektur text-white">
                            <SelectValue placeholder="Select action type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black/90 border-white/20 tektur text-white">
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="placement">Placement</SelectItem>
                          <SelectItem value="retrieval">Retrieval</SelectItem>
                          <SelectItem value="rearrangement">Rearrangement</SelectItem>
                          <SelectItem value="disposal">Disposal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Searching..." : "Search Logs"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {logs && (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="tektur text-white/90">Log Results</CardTitle>
            <CardDescription className="tektur text-white/70">
              Found {logs.logs?.length || 0} log entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.logs?.length > 0 ? (
              <div className="space-y-4">
                {logs.logs.map((log: any, index: number) => (
                  <Card key={index} className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-2 tektur text-sm">
                        <div className="text-white/70">Timestamp:</div>
                        <div className="text-white">{new Date(log.timestamp).toLocaleString()}</div>

                        <div className="text-white/70">User ID:</div>
                        <div className="text-white">{log.userId}</div>

                        <div className="text-white/70">Action Type:</div>
                        <div className="text-white">{log.actionType}</div>

                        <div className="text-white/70">Item ID:</div>
                        <div className="text-white">{log.itemId}</div>

                        {log.details && (
                          <>
                            {log.details.fromContainer && (
                              <>
                                <div className="text-white/70">From Container:</div>
                                <div className="text-white">{log.details.fromContainer}</div>
                              </>
                            )}

                            {log.details.toContainer && (
                              <>
                                <div className="text-white/70">To Container:</div>
                                <div className="text-white">{log.details.toContainer}</div>
                              </>
                            )}

                            {log.details.reason && (
                              <>
                                <div className="text-white/70">Reason:</div>
                                <div className="text-white">{log.details.reason}</div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-black/20 p-4 rounded tektur text-white text-center">
                No log entries found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

