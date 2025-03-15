"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, Trash, FastForward } from "lucide-react"

// Define the schema for the simulation form
const simulationFormSchema = z.object({
  numOfDays: z.number().min(1, "Number of days must be at least 1"),
  toTimestamp: z.string().optional(),
  itemsToBeUsedPerDay: z.array(
    z
      .object({
        itemId: z.string().optional(),
        name: z.string().optional(),
      })
      .refine((data) => data.itemId || data.name, {
        message: "Either Item ID or Name is required",
        path: ["itemId"],
      }),
  ),
})

type SimulationFormValues = z.infer<typeof simulationFormSchema>

export function SimulatePage() {
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Initialize the form with default values
  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationFormSchema),
    defaultValues: {
      numOfDays: 1,
      toTimestamp: "",
      itemsToBeUsedPerDay: [{ itemId: "", name: "" }],
    },
  })

  async function onSubmit(data: SimulationFormValues) {
    setLoading(true)
    try {
      // Call the API
      const response = await fetch("/api/simulate/day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      setSimulationResult(result)
    } catch (error) {
      console.error("Error simulating time:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white/90 tektur">Time Simulation</h2>
      </div>

      <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader>
          <CardTitle className="tektur text-white/90">Simulate Time Passage</CardTitle>
          <CardDescription className="tektur text-white/70">
            Simulate the passage of time and item usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numOfDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">Number of Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter number of days"
                          className="bg-black/20 border-white/20 tektur text-white"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription className="tektur text-white/60">How many days to simulate</FormDescription>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toTimestamp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="tektur text-white/80">To Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-black/20 border-white/20 tektur text-white" {...field} />
                      </FormControl>
                      <FormDescription className="tektur text-white/60">Alternative to number of days</FormDescription>
                      <FormMessage className="tektur text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="tektur text-white/90 text-sm">Items to Be Used Per Day</h3>

                {form.watch("itemsToBeUsedPerDay").map((item, index) => (
                  <Card key={index} className="bg-black/20 border-white/10">
                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                      <CardTitle className="tektur text-white/90 text-sm">Item {index + 1}</CardTitle>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentItems = form.getValues("itemsToBeUsedPerDay")
                            form.setValue(
                              "itemsToBeUsedPerDay",
                              currentItems.filter((_, i) => i !== index),
                            )
                          }}
                          className="h-6 w-6"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`itemsToBeUsedPerDay.${index}.itemId`}
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
                        name={`itemsToBeUsedPerDay.${index}.name`}
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
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 tektur border-white/20 bg-black/20 text-white"
                  onClick={() => {
                    form.setValue("itemsToBeUsedPerDay", [
                      ...form.getValues("itemsToBeUsedPerDay"),
                      { itemId: "", name: "" },
                    ])
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <Button type="submit" className="w-full tektur bg-blue-700 hover:bg-blue-600" disabled={loading}>
                <FastForward className="mr-2 h-4 w-4" />
                {loading ? "Simulating..." : "Simulate Time"}
              </Button>
            </form>
          </Form>

          {simulationResult && (
            <div className="mt-6">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="tektur text-white/90 text-sm">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 tektur text-sm">
                    <div className="text-white/70">New Date:</div>
                    <div className="text-white">{new Date(simulationResult.newDate).toLocaleString()}</div>
                  </div>

                  <div className="mt-4">
                    <h3 className="tektur text-white/90 mb-2">Items Used:</h3>
                    <div className="space-y-2">
                      {simulationResult.changes?.itemsUsed.map((item: any, index: number) => (
                        <div key={index} className="bg-black/30 p-2 rounded tektur text-sm">
                          <span className="text-white">
                            {item.name} ({item.itemId})
                          </span>{" "}
                          <span className="text-white/70">Remaining Uses: {item.remainingUses}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="tektur text-white/90 mb-2">Items Expired:</h3>
                    <div className="space-y-2">
                      {simulationResult.changes?.itemsExpired.length > 0 ? (
                        simulationResult.changes.itemsExpired.map((item: any, index: number) => (
                          <div key={index} className="bg-black/30 p-2 rounded tektur text-sm">
                            <span className="text-white">
                              {item.name} ({item.itemId})
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="bg-black/30 p-2 rounded tektur text-sm text-white/70">No items expired</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="tektur text-white/90 mb-2">Items Depleted Today:</h3>
                    <div className="space-y-2">
                      {simulationResult.changes?.itemsDepletedToday.length > 0 ? (
                        simulationResult.changes.itemsDepletedToday.map((item: any, index: number) => (
                          <div key={index} className="bg-black/30 p-2 rounded tektur text-sm">
                            <span className="text-white">
                              {item.name} ({item.itemId})
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="bg-black/30 p-2 rounded tektur text-sm text-white/70">No items depleted</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

