"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2 } from "lucide-react"

// Define the schema for the return plan form
const returnPlanFormSchema = z.object({
  undockingContainerId: z.string().min(1, "Container ID is required"),
  undockingDate: z.string().min(1, "Undocking date is required"),
  maxWeight: z.number().min(0, "Max weight must be positive"),
})

// Define the schema for the complete undocking form
const completeUndockingFormSchema = z.object({
  undockingContainerId: z.string().min(1, "Container ID is required"),
  timestamp: z.string().min(1, "Timestamp is required"),
})

type ReturnPlanFormValues = z.infer<typeof returnPlanFormSchema>
type CompleteUndockingFormValues = z.infer<typeof completeUndockingFormSchema>

export function WastePage() {
  const [activeTab, setActiveTab] = useState("identify")
  const [wasteItems, setWasteItems] = useState<any>(null)
  const [returnPlan, setReturnPlan] = useState<any>(null)
  const [undockingResult, setUndockingResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Initialize the return plan form
  const returnPlanForm = useForm<ReturnPlanFormValues>({
    resolver: zodResolver(returnPlanFormSchema),
    defaultValues: {
      undockingContainerId: "",
      undockingDate: new Date().toISOString().split("T")[0],
      maxWeight: 0,
    },
  })

  // Initialize the complete undocking form
  const completeUndockingForm = useForm<CompleteUndockingFormValues>({
    resolver: zodResolver(completeUndockingFormSchema),
    defaultValues: {
      undockingContainerId: "",
      timestamp: new Date().toISOString(),
    },
  })

  async function identifyWaste() {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/waste/identify")
      const result = await response.json()
      setWasteItems(result)
    } catch (error) {
      console.error("Error identifying waste:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onReturnPlanSubmit(data: ReturnPlanFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/waste/return-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setReturnPlan(result)

      // Pre-fill the complete undocking form if return plan was successful
      if (result.success) {
        completeUndockingForm.setValue("undockingContainerId", data.undockingContainerId)
      }
    } catch (error) {
      console.error("Error creating return plan:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onCompleteUndockingSubmit(data: CompleteUndockingFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/waste/complete-undocking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setUndockingResult(result)
    } catch (error) {
      console.error("Error completing undocking:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">Waste Management</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="identify" className="tektur">
            Identify Waste
          </TabsTrigger>
          <TabsTrigger value="return-plan" className="tektur">
            Return Plan
          </TabsTrigger>
          <TabsTrigger value="complete-undocking" className="tektur">
            Complete Undocking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="identify">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Identify Waste Items</CardTitle>
              <CardDescription className="tektur text-white/70">Find expired or depleted items</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={identifyWaste}
                className="w-full tektur bg-blue-700 hover:bg-blue-600"
                disabled={loading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {loading ? "Identifying..." : "Identify Waste Items"}
              </Button>

              {wasteItems && (
                <div className="mt-6">
                  <h3 className="tektur text-white/90 mb-4">Waste Items ({wasteItems.wasteItems?.length || 0})</h3>

                  {wasteItems.wasteItems?.length > 0 ? (
                    <div className="space-y-4">
                      {wasteItems.wasteItems.map((item: any, index: number) => (
                        <Card key={index} className="bg-black/20 border-white/10">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-2 tektur text-sm">
                              <div className="text-white/70">Item ID:</div>
                              <div className="text-white">{item.itemId}</div>

                              <div className="text-white/70">Name:</div>
                              <div className="text-white">{item.name}</div>

                              <div className="text-white/70">Reason:</div>
                              <div className="text-white">{item.reason}</div>

                              <div className="text-white/70">Container:</div>
                              <div className="text-white">{item.containerId}</div>

                              <div className="text-white/70">Position:</div>
                              <div className="text-white">
                                ({item.position.startCoordinates.width},{item.position.startCoordinates.depth},
                                {item.position.startCoordinates.height}) to ({item.position.endCoordinates.width},
                                {item.position.endCoordinates.depth},{item.position.endCoordinates.height})
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        className="w-full tektur bg-blue-700 hover:bg-blue-600"
                        onClick={() => {
                          setActiveTab("return-plan")
                        }}
                      >
                        Create Return Plan
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-black/20 p-4 rounded tektur text-white text-center">No waste items found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="return-plan">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Create Return Plan</CardTitle>
              <CardDescription className="tektur text-white/70">Plan for returning waste items</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...returnPlanForm}>
                <form onSubmit={returnPlanForm.handleSubmit(onReturnPlanSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={returnPlanForm.control}
                      name="undockingContainerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Undocking Container ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter container ID"
                              className="bg-black/20 border-white/20 tektur text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={returnPlanForm.control}
                      name="undockingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Undocking Date</FormLabel>
                          <FormControl>
                            <Input type="date" className="bg-black/20 border-white/20 tektur text-white" {...field} />
                          </FormControl>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={returnPlanForm.control}
                      name="maxWeight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Max Weight</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter max weight"
                              className="bg-black/20 border-white/20 tektur text-white"
                              {...field}
                              onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                    {loading ? "Creating Plan..." : "Create Return Plan"}
                  </Button>
                </form>
              </Form>

              {returnPlan && (
                <div className="mt-6">
                  <Tabs defaultValue="plan">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="plan" className="tektur">
                        Plan Steps
                      </TabsTrigger>
                      <TabsTrigger value="retrieval" className="tektur">
                        Retrieval
                      </TabsTrigger>
                      <TabsTrigger value="manifest" className="tektur">
                        Manifest
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="plan">
                      <div className="space-y-4">
                        {returnPlan.returnPlan?.map((step: any, index: number) => (
                          <Card key={index} className="bg-black/20 border-white/10">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 gap-2 tektur text-sm">
                                <div className="text-white/70">Step:</div>
                                <div className="text-white">{step.step}</div>

                                <div className="text-white/70">Item:</div>
                                <div className="text-white">
                                  {step.itemName} ({step.itemId})
                                </div>

                                <div className="text-white/70">From Container:</div>
                                <div className="text-white">{step.fromContainer}</div>

                                <div className="text-white/70">To Container:</div>
                                <div className="text-white">{step.toContainer}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="retrieval">
                      <div className="space-y-4">
                        {returnPlan.retrievalSteps?.map((step: any, index: number) => (
                          <Card key={index} className="bg-black/20 border-white/10">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 gap-2 tektur text-sm">
                                <div className="text-white/70">Step:</div>
                                <div className="text-white">{step.step}</div>

                                <div className="text-white/70">Action:</div>
                                <div className="text-white">{step.action}</div>

                                <div className="text-white/70">Item:</div>
                                <div className="text-white">
                                  {step.itemName} ({step.itemId})
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="manifest">
                      <Card className="bg-black/20 border-white/10">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-2 tektur text-sm">
                            <div className="text-white/70">Container ID:</div>
                            <div className="text-white">{returnPlan.returnManifest?.undockingContainerId}</div>

                            <div className="text-white/70">Undocking Date:</div>
                            <div className="text-white">{returnPlan.returnManifest?.undockingDate}</div>

                            <div className="text-white/70">Total Volume:</div>
                            <div className="text-white">{returnPlan.returnManifest?.totalVolume}</div>

                            <div className="text-white/70">Total Weight:</div>
                            <div className="text-white">{returnPlan.returnManifest?.totalWeight}</div>
                          </div>

                          <div className="mt-4">
                            <h3 className="tektur text-white/90 mb-2">Return Items:</h3>
                            <div className="space-y-2">
                              {returnPlan.returnManifest?.returnItems.map((item: any, index: number) => (
                                <div key={index} className="bg-black/30 p-2 rounded tektur text-sm">
                                  <span className="text-white">
                                    {item.name} ({item.itemId})
                                  </span>{" "}
                                  <span className="text-white/70">Reason: {item.reason}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Button
                        className="w-full mt-4 tektur bg-blue-700 hover:bg-blue-600"
                        onClick={() => {
                          setActiveTab("complete-undocking")
                          completeUndockingForm.setValue(
                            "undockingContainerId",
                            returnPlan.returnManifest?.undockingContainerId || "",
                          )
                        }}
                      >
                        Complete Undocking
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complete-undocking">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Complete Undocking</CardTitle>
              <CardDescription className="tektur text-white/70">Finalize the undocking process</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...completeUndockingForm}>
                <form onSubmit={completeUndockingForm.handleSubmit(onCompleteUndockingSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={completeUndockingForm.control}
                      name="undockingContainerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Undocking Container ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter container ID"
                              className="bg-black/20 border-white/20 tektur text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={completeUndockingForm.control}
                      name="timestamp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Timestamp</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              className="bg-black/20 border-white/20 tektur text-white"
                              {...field}
                              onChange={(e) => {
                                const date = new Date(e.target.value)
                                field.onChange(date.toISOString())
                              }}
                              value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                            />
                          </FormControl>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                    {loading ? "Processing..." : "Complete Undocking"}
                  </Button>
                </form>
              </Form>

              {undockingResult && (
                <div className="mt-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="tektur text-sm">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${undockingResult.success ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <div className="text-white">
                            {undockingResult.success
                              ? `Undocking completed successfully. ${undockingResult.itemsRemoved} items removed.`
                              : "Failed to complete undocking"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

