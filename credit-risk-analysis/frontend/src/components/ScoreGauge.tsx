import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  // Score is 300 to 850 in typical credit systems. But our backend passes 0-100? No, wait... 
  // Wait, backend returns 0-100 (probability). But user requested scale 300-850.
  // We can interpolate it on the frontend for visual impact.
  // 0 -> 300, 100 -> 850
  const normalizedScore = 300 + (score / 100) * 550;
  
  const data = [{
    name: "Score",
    value: normalizedScore,
    fill: normalizedScore >= 650 ? "#00ffcc" : normalizedScore >= 500 ? "#ffcc00" : "#ff5e00"
  }];

  return (
    <div className="h-64 w-full relative -mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="70%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[300, 850]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-16 pointer-events-none">
        <span className="text-5xl font-extrabold" style={{ color: data[0].fill }}>
          {Math.round(normalizedScore)}
        </span>
        <span className="text-sm text-gray-400 mt-1">FinScore</span>
      </div>
    </div>
  );
}
