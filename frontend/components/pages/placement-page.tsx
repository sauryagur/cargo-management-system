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
import { Plus, Trash } from "lucide-react"

// Define the schema for the form
const itemSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  name: z.string().min(1, "Name is required"),
  width: z.number().min(0, "Width must be positive"),
  depth: z.number().min(0, "Depth must be positive"),
  height: z.number().min(0, "Height must be positive"),
  priority: z.number().min(1).max(10, "Priority must be between 1-10"),
  expiryDate: z.string().optional(),
  usageLimit: z.number().min(0, "Usage limit must be positive"),
  preferredZone: z.string().optional(),
})

const containerSchema = z.object({
  containerId: z.string().min(1, "Container ID is required"),
  zone: z.string().min(1, "Zone is required"),
  width: z.number().min(0, "Width must be positive"),
  depth: z.number().min(0, "Depth must be positive"),
  height: z.number().min(0, "Height must be positive"),
})

const placementFormSchema = z.object({
  items: z.array(itemSchema).min(1, "At least one item is required"),
  containers: z.array(containerSchema).min(1, "At least one container is required"),
})

type PlacementFormValues = z.infer<typeof placementFormSchema>

export function PlacementPage() {
  const [placementResult, setPlacementResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Initialize the form with default values
  const form = useForm<PlacementFormValues>({
    resolver: zodResolver(placementFormSchema),
    defaultValues: {
      items: [
        {
          itemId: "",
          name: "",
          width: 0,
          depth: 0,
          height: 0,
          priority: 1,
          expiryDate: "",
          usageLimit: 0,
          preferredZone: "",
        },
      ],
      containers: [
        {
          containerId: "",
          zone: "",
          width: 0,
          depth: 0,
          height: 0,
        },
      ],
    },
  })

  const { fields: itemFields, append: appendItem, remove: removeItem } = form.control._formValues.items || []
  const {
    fields: containerFields,
    append: appendContainer,
    remove: removeContainer,
  } = form.control._formValues.containers || []

  async function onSubmit(data: PlacementFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/placement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setPlacementResult(result)
    } catch (error) {
      console.error("Error submitting placement request:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">Placement Recommendations</h2>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="tektur text-white/90">Optimize Item Placement</CardTitle>
          <CardDescription className="tektur text-white/70">
            Submit items and containers to get optimal placement recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="items" className="tektur">
                    Items
                  </TabsTrigger>
                  <TabsTrigger value="containers" className="tektur">
                    Containers
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="items" className="space-y-4">
                  {form.watch("items").map((item, index) => (
                    <Card key={index} className="bg-black/20 border-white/10">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="tektur text-white/90 text-sm">Item {index + 1}</CardTitle>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
                            className="h-6 w-6"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Item ID</FormLabel>
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
                          name={`items.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter item name"
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
                          name={`items.${index}.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Width</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Width"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.depth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Depth</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Depth"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.height`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Height</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Height"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.priority`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Priority (1-10)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Priority"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  min={1}
                                  max={10}
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.expiryDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Expiry Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
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
                          name={`items.${index}.usageLimit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Usage Limit</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Usage limit"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.preferredZone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Preferred Zone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Zone"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 tektur border-white/20 bg-black/20 text-white"
                    onClick={() => {
                      form.setValue("items", [
                        ...form.getValues("items"),
                        {
                          itemId: "",
                          name: "",
                          width: 0,
                          depth: 0,
                          height: 0,
                          priority: 1,
                          expiryDate: "",
                          usageLimit: 0,
                          preferredZone: "",
                        },
                      ])
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </TabsContent>

                <TabsContent value="containers" className="space-y-4">
                  {form.watch("containers").map((container, index) => (
                    <Card key={index} className="bg-black/20 border-white/10">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="tektur text-white/90 text-sm">Container {index + 1}</CardTitle>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeContainer(index)}
                            className="h-6 w-6"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`containers.${index}.containerId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Container ID</FormLabel>
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
                          control={form.control}
                          name={`containers.${index}.zone`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Zone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter zone"
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
                          name={`containers.${index}.width`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Width</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Width"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`containers.${index}.depth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Depth</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Depth"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`containers.${index}.height`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="tektur text-white/80">Height</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Height"
                                  className="bg-black/20 border-white/20 tektur text-white"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage className="tektur text-red-400" />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 tektur border-white/20 bg-black/20 text-white"
                    onClick={() => {
                      form.setValue("containers", [
                        ...form.getValues("containers"),
                        {
                          containerId: "",
                          zone: "",
                          width: 0,
                          depth: 0,
                          height: 0,
                        },
                      ])
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Container
                  </Button>
                </TabsContent>
              </Tabs>

              <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                {loading ? "Processing..." : "Get Placement Recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {placementResult && (
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
          <CardHeader>
            <CardTitle className="tektur text-white/90">Placement Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="placements">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="placements" className="tektur">
                  Placements
                </TabsTrigger>
                <TabsTrigger value="rearrangements" className="tektur">
                  Rearrangements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="placements">
                <div className="space-y-4">
                  {placementResult.placements?.map((placement: any, index: number) => (
                    <Card key={index} className="bg-black/20 border-white/10">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2 tektur text-sm">
                          <div className="text-white/70">Item ID:</div>
                          <div className="text-white">{placement.itemId}</div>

                          <div className="text-white/70">Container ID:</div>
                          <div className="text-white">{placement.containerId}</div>

                          <div className="text-white/70">Position:</div>
                          <div className="text-white">
                            ({placement.position.startCoordinates.width},{placement.position.startCoordinates.depth},
                            {placement.position.startCoordinates.height}) to ({placement.position.endCoordinates.width},
                            {placement.position.endCoordinates.depth},{placement.position.endCoordinates.height})
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rearrangements">
                <div className="space-y-4">
                  {placementResult.rearrangements?.map((rearrangement: any, index: number) => (
                    <Card key={index} className="bg-black/20 border-white/10">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-2 tektur text-sm">
                          <div className="text-white/70">Step:</div>
                          <div className="text-white">{rearrangement.step}</div>

                          <div className="text-white/70">Action:</div>
                          <div className="text-white">{rearrangement.action}</div>

                          <div className="text-white/70">Item ID:</div>
                          <div className="text-white">{rearrangement.itemId}</div>

                          <div className="text-white/70">From Container:</div>
                          <div className="text-white">{rearrangement.fromContainer}</div>

                          <div className="text-white/70">To Container:</div>
                          <div className="text-white">{rearrangement.toContainer}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

