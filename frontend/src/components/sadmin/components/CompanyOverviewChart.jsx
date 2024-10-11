import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Users, Briefcase, UserPlus, Filter, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span style={{ color: entry.color }}>{entry.name === 'employees' ? <Users size={16} /> : entry.name === 'jobs' ? <Briefcase size={16} /> : <UserPlus size={16} />}</span>
            <p className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

export function CompanyOverviewChart({ companyData }) {
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [filters, setFilters] = useState({
    employees: { show: true, min: 0, max: Infinity },
    jobs: { show: true, min: 0, max: Infinity },
    applicants: { show: true, min: 0, max: Infinity },
  });

  const filteredData = useMemo(() => {
    let data = selectedCompany === 'all' ? companyData : companyData.filter(company => company.name === selectedCompany);
    return data.filter(company => {
      return Object.entries(filters).every(([key, filter]) => {
        if (!filter.show) return true;
        const value = company[key];
        return value >= filter.min && value <= filter.max;
      });
    }).map(company => {
      const filteredCompany = { name: company.name };
      Object.entries(filters).forEach(([key, filter]) => {
        if (filter.show) filteredCompany[key] = company[key];
      });
      return filteredCompany;
    });
  }, [companyData, selectedCompany, filters]);

  const handleFilterChange = (filter, property, value) => {
    setFilters(prev => ({
      ...prev,
      [filter]: { ...prev[filter], [property]: value }
    }));
  };

  const maxValues = useMemo(() => {
    return companyData.reduce((acc, company) => {
      Object.keys(filters).forEach(key => {
        acc[key] = Math.max(acc[key] || 0, company[key] || 0);
      });
      return acc;
    }, {});
  }, [companyData, filters]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Company Overview</span>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companyData.map(company => (
                  <SelectItem key={company.name} value={company.name}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={company?.logo || "/placeholder.svg?height=40&width=40"}
                          alt={`${company?.name} logo`}
                          className="object-cover"
                        />
                        <AvatarFallback>{company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{company.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none mb-3">Advanced Filters</h4>
                  {Object.entries(filters).map(([key, filter]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                        <Checkbox
                          id={key}
                          checked={filter.show}
                          onCheckedChange={(checked) => handleFilterChange(key, 'show', checked)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={filter.min}
                          onChange={(e) => handleFilterChange(key, 'min', Number(e.target.value))}
                          className="w-20"
                          min={0}
                          max={filter.max}
                        />
                        <Slider
                          min={0}
                          max={maxValues[key]}
                          step={1}
                          value={[filter.min, filter.max]}
                          onValueChange={([min, max]) => {
                            handleFilterChange(key, 'min', min);
                            handleFilterChange(key, 'max', max);
                          }}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={filter.max === Infinity ? maxValues[key] : filter.max}
                          onChange={(e) => handleFilterChange(key, 'max', Number(e.target.value))}
                          className="w-20"
                          min={filter.min}
                          max={maxValues[key]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px]">
          <AnimatePresence>
            {filteredData.length > 0 ? (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" />
                    {filters.employees.show && <Bar dataKey="employees" fill="#4C51BF" radius={[4, 4, 0, 0]} />}
                    {filters.jobs.show && <Bar dataKey="jobs" fill="#48BB78" radius={[4, 4, 0, 0]} />}
                    {filters.applicants.show && <Bar dataKey="applicants" fill="#ECC94B" radius={[4, 4, 0, 0]} />}
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center h-full"
              >
                <p className="text-gray-500 dark:text-gray-400">No data available</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}