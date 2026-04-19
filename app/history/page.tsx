"use client";

import { useStore } from "../_components/StoreProvider";
import { rankLabel } from "../_lib/data";

export default function HistoryPage() {
  const { matches } = useStore();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-nord6">履歴</h1>

      <div className="bg-nord1 rounded-xl p-5">
        {matches.length === 0 ? (
          <p className="text-nord4 text-sm">試合記録なし</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-nord4 border-b border-nord3">
                  <th className="text-left py-2 font-medium">日付</th>
                  <th className="text-left py-2 font-medium">ルール</th>
                  <th className="text-left py-2 font-medium">マップ</th>
                  <th className="text-center py-2 font-medium">結果</th>
                  <th className="text-right py-2 font-medium">ランク</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => {
                  const resultCls =
                    m.result === "VICTORY"
                      ? "bg-nord14/20 text-nord14"
                      : m.result === "DEFEAT"
                        ? "bg-nord11/20 text-nord11"
                        : "bg-nord13/20 text-nord13";
                  const resultLabel =
                    m.result === "VICTORY"
                      ? "勝利"
                      : m.result === "DEFEAT"
                        ? "敗北"
                        : "引き分け";
                  return (
                    <tr key={m.id} className="border-b border-nord2 last:border-0">
                      <td className="py-2 text-nord4 whitespace-nowrap">
                        {m.date}
                      </td>
                      <td className="py-2 text-nord4">{m.rule}</td>
                      <td className="py-2 text-nord6">{m.map}</td>
                      <td className="py-2 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${resultCls}`}
                        >
                          {resultLabel}
                        </span>
                      </td>
                      <td className="py-2 text-nord6 text-right whitespace-nowrap">
                        {rankLabel(m.rank)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
