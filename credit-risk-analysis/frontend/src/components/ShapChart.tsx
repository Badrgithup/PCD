import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ShapChartProps {
  strengths: any[];
  weaknesses: any[];
}

export default function ShapChart({ strengths, weaknesses }: ShapChartProps) {
  // Combine and format for Recharts
  const data = [
    ...strengths.map(s => ({ name: s.feature.replace(/_/g, ' '), shap: s.shap_value, type: 'strength' })),
    ...weaknesses.map(w => ({ name: w.feature.replace(/_/g, ' '), shap: w.shap_value, type: 'weakness' }))
  ].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap)).slice(0, 5); // top 5 absolute drivers

  return (
    <div className="h-64 w-full text-sm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
          <Bar dataKey="shap" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={entry.shap > 0 ? '#00ffcc' : '#ff5e00'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
