"use client";

import { useStore } from "../_components/StoreProvider";
import { MAPS_BY_RULE, RULES } from "../_lib/data";

export default function StatsPage() {
  const { settings, matches } = useStore();

  const seasonMatches = settings
    ? matches.filter((m) => m.season === settings.season)
    : matches;

  const ruleStats: Record<
    string,
    { wins: number; losses: number; draws: number }
  > = {};
  for (const rule of RULES) {
    ruleStats[rule] = { wins: 0, losses: 0, draws: 0 };
  }
  for (const m of seasonMatches) {
    if (m.result === "VICTORY") ruleStats[m.rule].wins++;
    else if (m.result === "DEFEAT") ruleStats[m.rule].losses++;
    else ruleStats[m.rule].draws++;
  }

  const mapStats: Record<
    string,
    { wins: number; losses: number; draws: number }
  > = {};
  for (const m of seasonMatches) {
    if (!mapStats[m.map]) mapStats[m.map] = { wins: 0, losses: 0, draws: 0 };
    if (m.result === "VICTORY") mapStats[m.map].wins++;
    else if (m.result === "DEFEAT") mapStats[m.map].losses++;
    else mapStats[m.map].draws++;
  }

  const card = "bg-nord1 rounded-xl p-5";

  function StatsTable({
    rows,
  }: {
    rows: { label: string; wins: number; losses: number; draws: number }[];
  }) {
    const hasData = rows.some((r) => r.wins + r.losses + r.draws > 0);
    if (!hasData) return <p className="text-nord4 text-sm">データなし</p>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-nord4 border-b border-nord3">
              <th className="text-left py-2 font-medium">名前</th>
              <th className="text-right py-2 font-medium w-14">勝利</th>
              <th className="text-right py-2 font-medium w-14">敗北</th>
              <th className="text-right py-2 font-medium w-14">引分</th>
              <th className="text-right py-2 font-medium w-16">勝率</th>
            </tr>
          </thead>
          <tbody>
            {rows
              .filter((r) => r.wins + r.losses + r.draws > 0)
              .map(({ label, wins, losses, draws }) => {
                const wr =
                  wins + losses > 0
                    ? Math.round((wins / (wins + losses)) * 100)
                    : null;
                return (
                  <tr key={label} className="border-b border-nord2 last:border-0">
                    <td className="py-2 text-nord6">{label}</td>
                    <td className="py-2 text-nord14 text-right">{wins}</td>
                    <td className="py-2 text-nord11 text-right">{losses}</td>
                    <td className="py-2 text-nord13 text-right">{draws}</td>
                    <td className="py-2 text-nord8 text-right font-medium">
                      {wr !== null ? `${wr}%` : "-"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-nord6">統計</h1>

      <div className={card}>
        <h2 className="text-nord6 font-semibold mb-4">ルール別</h2>
        <StatsTable
          rows={RULES.map((rule) => ({ label: rule, ...ruleStats[rule] }))}
        />
      </div>

      {RULES.map((rule) => {
        const mapsWithData = MAPS_BY_RULE[rule].filter(
          (map) =>
            mapStats[map] &&
            mapStats[map].wins + mapStats[map].losses + mapStats[map].draws > 0
        );
        if (mapsWithData.length === 0) return null;

        return (
          <div key={rule} className={card}>
            <h2 className="text-nord6 font-semibold mb-4">
              マップ別 — {rule}
            </h2>
            <StatsTable
              rows={mapsWithData.map((map) => ({
                label: map,
                ...mapStats[map],
              }))}
            />
          </div>
        );
      })}
    </div>
  );
}
