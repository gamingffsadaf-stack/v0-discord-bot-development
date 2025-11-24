"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface Server {
  id: string
  name: string
  icon: string | null
}

interface ServerSelectorProps {
  servers: Server[]
  selectedServer: Server | null
  onSelectServer: (server: Server) => void
}

export function ServerSelector({ servers, selectedServer, onSelectServer }: ServerSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between glass-card border-primary/20 hover:border-primary/40 bg-transparent"
        >
          {selectedServer ? (
            <div className="flex items-center gap-2">
              {selectedServer.icon && (
                <img
                  src={selectedServer.icon || "/placeholder.svg"}
                  alt={selectedServer.name}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{selectedServer.name}</span>
            </div>
          ) : (
            "Select server..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 glass-card border-primary/20">
        <Command>
          <CommandInput placeholder="Search server..." />
          <CommandList>
            <CommandEmpty>No server found.</CommandEmpty>
            <CommandGroup>
              {servers.map((server) => (
                <CommandItem
                  key={server.id}
                  value={server.name}
                  onSelect={() => {
                    onSelectServer(server)
                    setOpen(false)
                  }}
                  className="hover:bg-primary/10"
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedServer?.id === server.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex items-center gap-2">
                    {server.icon && (
                      <img src={server.icon || "/placeholder.svg"} alt={server.name} className="w-5 h-5 rounded-full" />
                    )}
                    <span>{server.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
