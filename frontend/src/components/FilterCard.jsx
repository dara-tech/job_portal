import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSearchedQuery } from "@/redux/jobSlice"
import { Filter, X, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const filterData = [
  {
    filterType: "Location",
    array: [
      "Banteay Meanchey", "Battambang", "Kandal", "Kep", "Koh Kong",
      "Krong Preah Sihanouk", "Krong Pailin", "Kampong Cham", "Kampong Chhnang",
      "Kampong Speu", "Kampong Thom", "Kampot", "Kratie", "Mondulkiri",
      "Phnom Penh", "Preah Vihear", "Prey Veng", "Siem Reap", "Sihanoukville",
      "Stung Treng", "Svay Rieng", "Takeo", "Tboung Khmum"
    ]
  },
  {
    filterType: "Industry",
    array: [
      "Software Development", "Data Science", "Healthcare", "Finance",
      "Education", "Marketing", "Sales", "Engineering", "Customer Service",
      "Human Resources", "Legal", "Construction", "Manufacturing", "Retail",
      "Information Technology", "Consulting", "Logistics", "Real Estate",
      "Entertainment", "Media", "Telecommunications", "Hospitality",
      "Transportation", "Energy", "Government", "Agriculture", "Tourism",
      "Pharmaceuticals", "Non-Profit", "Startups", "Automotive"
    ]
  },
  {
    filterType: "Salary",
    array: ["0-100", "100-1000", "1000-10K"],
  },
]

const FilterCard = ({ setSortOrder, onSearch = () => {} }) => {
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("jobFilters")
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          Location: [],
          Industry: [],
          Salary: [],
        }
  })
  const [searchKeyword, setSearchKeyword] = useState("")
  const [sortOrder, setSortOrderState] = useState("latest")

  const dispatch = useDispatch()

  useEffect(() => {
    const activeFilters = Object.entries(selectedFilters)
      .flatMap(([key, values]) => 
        Array.isArray(values) ? values.map(value => `${key.toLowerCase()}:${value}`) : []
      )

    const keyword = [searchKeyword, ...activeFilters].filter(Boolean).join(" ")
    dispatch(setSearchedQuery(keyword))
    onSearch(keyword)

    localStorage.setItem("jobFilters", JSON.stringify(selectedFilters))
  }, [selectedFilters, searchKeyword, dispatch, onSearch])

  const handleSelect = (filterType, item) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterType]: Array.isArray(prevState[filterType])
        ? prevState[filterType].includes(item)
          ? prevState[filterType].filter((i) => i !== item)
          : [...prevState[filterType], item]
        : [item],
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      Location: [],
      Industry: [],
      Salary: [],
    })
    setSearchKeyword("")
    localStorage.removeItem("jobFilters")
  }

  const handleSortChange = (value) => {
    setSortOrderState(value)
    setSortOrder(value)
  }

  const removeFilter = (filterType, item) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [filterType]: Array.isArray(prevState[filterType])
        ? prevState[filterType].filter((i) => i !== item)
        : [],
    }))
  }

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    onSearch(searchKeyword)
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search jobs..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="flex-grow"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
        <div className="flex flex-wrap items-center gap-4">
          {filterData.map((filter) => (
            <DropdownMenu key={filter.filterType}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9">
                  {filter.filterType}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <ScrollArea className="h-72">
                  {filter.array.map((item, itemIndex) => (
                    <DropdownMenuItem
                      key={itemIndex}
                      onSelect={() => handleSelect(filter.filterType, item)}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={Array.isArray(selectedFilters[filter.filterType]) && selectedFilters[filter.filterType].includes(item)}
                          onChange={() => {}}
                          className="h-4 w-4"
                        />
                        <span>{item}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Select value={sortOrder} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Sort by Latest</SelectItem>
              <SelectItem value="salary">Sort by Salary</SelectItem>
            </SelectContent>
          </Select>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={clearFilters} className="h-9 w-9">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear all filters</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {searchKeyword && (
            <Badge variant="secondary">
              {searchKeyword}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
                onClick={() => setSearchKeyword("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {Object.entries(selectedFilters).map(([filterType, values]) =>
            Array.isArray(values) && values.map((item) => (
              <Badge key={`${filterType}-${item}`} variant="secondary">
                {filterType}: {item}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2"
                  onClick={() => removeFilter(filterType, item)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterCard