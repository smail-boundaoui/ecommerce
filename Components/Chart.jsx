import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

export default function ChartCom({ data }) {
  const chartData = data.map((d) => {
    return { name: d.name, Products: d.products.length }
  })

  return (
    <div style={{ width: 1000, margin: "60px auto 0" }}>
      <BarChart width={1000} height={360} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Products" fill="#8884d8" barSize={30} />
      </BarChart>
    </div>
  )
}
