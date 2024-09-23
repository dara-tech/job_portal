import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CompanyOverviewChart({ companyData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        {companyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                scale="auto"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                scale="auto"
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="employees" fill="#8884d8" name="Employees" />
              <Bar dataKey="jobs" fill="#82ca9d" name="Jobs" />
              <Bar dataKey="applicants" fill="#ffc658" name="Applicants" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No company data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}