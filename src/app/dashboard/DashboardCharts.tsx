'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e']

export function EmploymentChart({ data }: { data: any[] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Privé/Public', value: 45 },
    { name: 'Sans emploi', value: 25 },
    { name: 'Entrepreneur', value: 15 },
    { name: 'Étudiant', value: 15 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SectorChart({ data }: { data: any[] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Santé', value: 40 },
    { name: 'Admin', value: 20 },
    { name: 'Labo', value: 15 },
    { name: 'Urgence', value: 10 },
    { name: 'Autre', value: 15 },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="value" 
            fill="#4f46e5" 
            radius={[12, 12, 0, 0]} 
            barSize={44} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
