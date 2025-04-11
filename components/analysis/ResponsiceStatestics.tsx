"use client";

export function ResponciveStatistics({ data, question }: { data: any, question: string }) {
    return (
      <div>
        <h4 className="text-base font-semibold text-foreground mb-4">Response Statistics</h4>
        <div className="space-y-4 bg-muted/10 p-5 rounded-xl shadow-inner border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Question:</span>
            <span className="font-medium text-right">{question}</span>
          </div>
  
          <div>
            <p className="text-muted-foreground text-sm mb-2">Option-wise Responses:</p>
            <ul className="space-y-1">
              {data.map((d: any, id: number) => (
                <li
                  key={id}
                  className="flex justify-between px-3 py-1 rounded-md hover:bg-white/10 transition text-sm"
                >
                  <span className="text-foreground">{d.name}</span>
                  <span className="font-medium text-muted-foreground">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>)
  }