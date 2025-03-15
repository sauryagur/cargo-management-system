"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

// Define the schema for the search form
const searchFormSchema = z
  .object({
    itemId: z.string().optional(),
    itemName: z.string().optional(),
    userId: z.string().optional(),
  })
  .refine((data) => data.itemId || data.itemName, {
    message: "Either Item ID or Item Name is required",
    path: ["itemId"],
  })

// Define the schema for the retrieve form
const retrieveFormSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  userId: z.string().min(1, "User ID is required"),
  timestamp: z.string().optional(),
})

// Define the schema for the place form
const placeFormSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  userId: z.string().min(1, "User ID is required"),
  timestamp: z.string().optional(),
  containerId: z.string().min(1, "Container ID is required"),
  position: z.object({
    startCoordinates: z.object({
      width: z.number().min(0),
      depth: z.number().min(0),
      height: z.number().min(0),
    }),
    endCoordinates: z.object({
      width: z.number().min(0),
      depth: z.number().min(0),
      height: z.number().min(0),
    }),
  }),
})

type SearchFormValues = z.infer<typeof searchFormSchema>
type RetrieveFormValues = z.infer<typeof retrieveFormSchema>
type PlaceFormValues = z.infer<typeof placeFormSchema>

export function SearchPage() {
  const [activeTab, setActiveTab] = useState("search")
  const [searchResult, setSearchResult] = useState<any>(null)
  const [retrieveResult, setRetrieveResult] = useState<any>(null)
  const [placeResult, setPlaceResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Initialize the search form
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      itemId: "",
      itemName: "",
      userId: "",
    },
  })

  // Initialize the retrieve form
  const retrieveForm = useForm<RetrieveFormValues>({
    resolver: zodResolver(retrieveFormSchema),
    defaultValues: {
      itemId: "",
      userId: "",
      timestamp: new Date().toISOString(),
    },
  })

  // Initialize the place form
  const placeForm = useForm<PlaceFormValues>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      itemId: "",
      userId: "",
      timestamp: new Date().toISOString(),
      containerId: "",
      position: {
        startCoordinates: {
          width: 0,
          depth: 0,
          height: 0,
        },
        endCoordinates: {
          width: 0,
          depth: 0,
          height: 0,
        },
      },
    },
  })

  async function onSearchSubmit(data: SearchFormValues) {
    setLoading(true)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (data.itemId) params.append("itemId", data.itemId)
      if (data.itemName) params.append("itemName", data.itemName)
      if (data.userId) params.append("userId", data.userId)

      // Call the API
      const response = await fetch(`/api/search?${params.toString()}`)
      const result = await response.json()
      setSearchResult(result)

      // If item found, pre-fill the retrieve form
      if (result.found) {
        retrieveForm.setValue("itemId", result.item.itemId)
        if (data.userId) retrieveForm.setValue("userId", data.userId)
      }
    } catch (error) {
      console.error("Error searching for item:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onRetrieveSubmit(data: RetrieveFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setRetrieveResult(result)

      // Pre-fill the place form if retrieve was successful
      if (result.success) {
        placeForm.setValue("itemId", data.itemId)
        placeForm.setValue("userId", data.userId)
      }
    } catch (error) {
      console.error("Error retrieving item:", error)
    } finally {
      setLoading(false)
    }
  }

  async function onPlaceSubmit(data: PlaceFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setPlaceResult(result)
    } catch (error) {
      console.error("Error placing item:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">Item Search & Retrieval</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="search" className="tektur">
            Search
          </TabsTrigger>
          <TabsTrigger value="retrieve" className="tektur">
            Retrieve
          </TabsTrigger>
          <TabsTrigger value="place" className="tektur">
            Place
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Search for Items</CardTitle>
              <CardDescription className="tektur text-white/70">Find items by ID or name</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...searchForm}>
                <form onSubmit={searchForm.handleSubmit(onSearchSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={searchForm.control}
                      name="itemId"
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
                          <FormDescription className="tektur text-white/60">
                            Enter either Item ID or Item Name
                          </FormDescription>
                          <FormMessage className="tektur text-red-400" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={searchForm.control}
                      name="itemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">Item Name</FormLabel>
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
                      control={searchForm.control}
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
                  </div>

                  <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </form>
              </Form>

              {searchResult && (
                <div className="mt-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardHeader>
                      <CardTitle className="tektur text-white/90 text-sm">
                        {searchResult.found ? "Item Found" : "Item Not Found"}
                      </CardTitle>
                    </CardHeader>
                    {searchResult.found && (
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2 tektur text-sm">
                          <div className="text-white/70">Item ID:</div>
                          <div className="text-white">{searchResult.item.itemId}</div>

                          <div className="text-white/70">Name:</div>
                          <div className="text-white">{searchResult.item.name}</div>

                          <div className="text-white/70">Container:</div>
                          <div className="text-white">{searchResult.item.containerId}</div>

                          <div className="text-white/70">Zone:</div>
                          <div className="text-white">{searchResult.item.zone}</div>

                          <div className="text-white/70">Position:</div>
                          <div className="text-white">
                            ({searchResult.item.position.startCoordinates.width},
                            {searchResult.item.position.startCoordinates.depth},
                            {searchResult.item.position.startCoordinates.height}) to (
                            {searchResult.item.position.endCoordinates.width},
                            {searchResult.item.position.endCoordinates.depth},
                            {searchResult.item.position.endCoordinates.height})
                          </div>
                        </div>

                        {searchResult.retrievalSteps && searchResult.retrievalSteps.length > 0 && (
                          <div className="mt-4">
                            <h3 className="tektur text-white/90 mb-2">Retrieval Steps:</h3>
                            <div className="space-y-2">
                              {searchResult.retrievalSteps.map((step: any, index: number) => (
                                <div key={index} className="bg-black/30 p-2 rounded tektur text-sm">
                                  <span className="text-white/70">Step {step.step}:</span>{" "}
                                  <span className="text-white">{step.action}</span>{" "}
                                  <span className="text-white/70">Item:</span>{" "}
                                  <span className="text-white">
                                    {step.itemName} ({step.itemId})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          className="w-full mt-4 tektur bg-blue-700 hover:bg-blue-600"
                          onClick={() => {
                            setActiveTab("retrieve")
                          }}
                        >
                          Proceed to Retrieve
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retrieve">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Retrieve Item</CardTitle>
              <CardDescription className="tektur text-white/70">Record item retrieval</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...retrieveForm}>
                <form onSubmit={retrieveForm.handleSubmit(onRetrieveSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={retrieveForm.control}
                      name="itemId"
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
                      control={retrieveForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">User ID</FormLabel>
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
                      control={retrieveForm.control}
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
                    {loading ? "Processing..." : "Retrieve Item"}
                  </Button>
                </form>
              </Form>

              {retrieveResult && (
                <div className="mt-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="tektur text-sm">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${retrieveResult.success ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <div className="text-white">
                            {retrieveResult.success ? "Item successfully retrieved" : "Failed to retrieve item"}
                          </div>
                        </div>

                        {retrieveResult.success && (
                          <Button
                            className="w-full mt-4 tektur bg-blue-700 hover:bg-blue-600"
                            onClick={() => {
                              setActiveTab("place")
                            }}
                          >
                            Proceed to Place
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="place">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="tektur text-white/90">Place Item</CardTitle>
              <CardDescription className="tektur text-white/70">Record item placement</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...placeForm}>
                <form onSubmit={placeForm.handleSubmit(onPlaceSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={placeForm.control}
                      name="itemId"
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
                      control={placeForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="tektur text-white/80">User ID</FormLabel>
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
                      control={placeForm.control}
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
                    <FormField
                      control={placeForm.control}
                      name="containerId"
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="tektur text-white/90 text-sm">Start Coordinates</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={placeForm.control}
                        name="position.startCoordinates.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Width</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                        control={placeForm.control}
                        name="position.startCoordinates.depth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Depth</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                        control={placeForm.control}
                        name="position.startCoordinates.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Height</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                  </div>

                  <div className="space-y-4">
                    <h3 className="tektur text-white/90 text-sm">End Coordinates</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={placeForm.control}
                        name="position.endCoordinates.width"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Width</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                        control={placeForm.control}
                        name="position.endCoordinates.depth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Depth</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                        control={placeForm.control}
                        name="position.endCoordinates.height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tektur text-white/80">Height</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
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
                  </div>

                  <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                    {loading ? "Processing..." : "Place Item"}
                  </Button>
                </form>
              </Form>

              {placeResult && (
                <div className="mt-6">
                  <Card className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="tektur text-sm">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${placeResult.success ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                          <div className="text-white">
                            {placeResult.success ? "Item successfully placed" : "Failed to place item"}
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

