"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MatchRowActions } from "./_components/MatchRowActions";
import { useStore } from "./_components/StoreProvider";
import { rankLabel, rankToNumber, TIERS } from "./_lib/data";
import type { Match } from "./_types";

function rankFromNumber(n: number): string {
  const tierIndex = Math.floor((n - 1) / 5);
  const division = 5 - ((n - 1) % 5);
  const tier = TIERS[Math.min(tierIndex, TIERS.length - 1)];
  return `${tier} ${division}`;
}

function RankGraph({ matches }: { matches: Match[] }) {
  if (matches.length < 2) {
    return (
      <p className="text-nord4 text-sm">
        グラフ表示には2試合以上の記録が必要です。
      </p>
    );
  }

  const data = [...matches].reverse().map((m, i) => ({
    index: i + 1,
    rank: rankToNumber(m.rank),
    label: m.date,
  }));

  const values = data.map((d) => d.rank);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const pad = 1;

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4C566A" />
        <XAxis dataKey="label" tick={{ fill: "#D8DEE9", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis
          domain={[minVal - pad, maxVal + pad]}
          tickFormatter={(v: number) => Number.isInteger(v) ? rankFromNumber(v) : ""}
          allowDecimals={false}
          tick={{ fill: "#D8DEE9", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={100}
        />
        <Tooltip
          formatter={(value) => [rankFromNumber(Number(value)), "ランク"]}
          labelFormatter={(label) => `日付: ${label}`}
          contentStyle={{ background: "#3B4252", border: "1px solid #4C566A", borderRadius: 8 }}
          labelStyle={{ color: "#D8DEE9" }}
          itemStyle={{ color: "#88C0D0" }}
        />
        <Line
          type="monotone"
          dataKey="rank"
          stroke="#88C0D0"
          strokeWidth={2}
          dot={{ fill: "#88C0D0", r: 4 }}
          activeDot={{ r: 6, fill: "#81A1C1" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ResultBadge({ result }: { result: Match["result"] }) {
  const cls =
    result === "VICTORY"
      ? "bg-nord14/20 text-nord14"
      : result === "DEFEAT"
        ? "bg-nord11/20 text-nord11"
        : "bg-nord13/20 text-nord13";
  const label =
    result === "VICTORY" ? "勝利" : result === "DEFEAT" ? "敗北" : "引き分け";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const { settings, matches } = useStore();

  if (!settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-nord4 text-lg">初期設定が完了していません。</p>
        <Link
          href="/settings"
          className="bg-nord10 hover:bg-nord9 text-nord6 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          初期設定へ
        </Link>
      </div>
    );
  }

  const seasonMatches = matches.filter((m) => m.season === settings.season);
  const wins = seasonMatches.filter((m) => m.result === "VICTORY").length;
  const losses = seasonMatches.filter((m) => m.result === "DEFEAT").length;
  const total = seasonMatches.length;
  const winRateBase = wins + losses;
  const winRate =
    winRateBase > 0 ? Math.round((wins / winRateBase) * 100) : 0;
  const winsRemaining = Math.max(0, settings.seasonGoalWins - wins);

  const currentRank =
    matches.length > 0 ? matches[0].rank : settings.initialRank;
  const allRanks = [settings.initialRank, ...matches.map((m) => m.rank)];
  const highestRank = allRanks.reduce((best, r) =>
    rankToNumber(r) > rankToNumber(best) ? r : best
  );

  const ruleStats: Record<string, { wins: number; losses: number }> = {};
  for (const m of seasonMatches) {
    if (m.result === "DRAW") continue;
    if (!ruleStats[m.rule]) ruleStats[m.rule] = { wins: 0, losses: 0 };
    if (m.result === "VICTORY") ruleStats[m.rule].wins++;
    else ruleStats[m.rule].losses++;
  }

  const mapCount: Record<
    string,
    { wins: number; losses: number; total: number }
  > = {};
  for (const m of seasonMatches) {
    if (!mapCount[m.map]) mapCount[m.map] = { wins: 0, losses: 0, total: 0 };
    mapCount[m.map].total++;
    if (m.result === "VICTORY") mapCount[m.map].wins++;
    else if (m.result === "DEFEAT") mapCount[m.map].losses++;
  }
  const top5Maps = Object.entries(mapCount)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  const recent10 = matches.slice(0, 10);
  const card = "bg-nord1 rounded-xl p-5";
  const muted = "text-nord4 text-sm";

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className={card}>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-nord6">
              {settings.playerName}
            </h1>
            <p className={`${muted} mt-1`}>
              {settings.hero} · Season {settings.season}
            </p>
          </div>
          <div className="text-right">
            <p className={muted}>シーズン目標</p>
            <p className="text-nord6 font-semibold text-lg">
              {wins} / {settings.seasonGoalWins}勝
            </p>
            {winsRemaining > 0 ? (
              <p className="text-nord13 text-sm">あと{winsRemaining}勝</p>
            ) : (
              <p className="text-nord14 text-sm font-medium">目標達成!</p>
            )}
          </div>
        </div>
      </div>

      {/* 基本統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={card}>
          <p className={muted}>総試合数</p>
          <p className="text-2xl font-bold text-nord6 mt-1">{total}</p>
        </div>
        <div className={card}>
          <p className={muted}>勝利</p>
          <p className="text-2xl font-bold text-nord14 mt-1">{wins}</p>
        </div>
        <div className={card}>
          <p className={muted}>敗北</p>
          <p className="text-2xl font-bold text-nord11 mt-1">{losses}</p>
        </div>
        <div className={card}>
          <p className={muted}>勝率</p>
          <p className="text-2xl font-bold text-nord8 mt-1">{winRate}%</p>
          <p className="text-nord4 text-xs">DRAW除く</p>
        </div>
      </div>

      {/* ランク推移 */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-nord6 font-semibold">ランク推移</h2>
          <div className="flex gap-6 text-sm">
            <div className="text-right">
              <p className={muted}>現在</p>
              <p className="text-nord6 font-semibold">
                {rankLabel(currentRank)}
              </p>
            </div>
            <div className="text-right">
              <p className={muted}>最高</p>
              <p className="text-nord8 font-semibold">
                {rankLabel(highestRank)}
              </p>
            </div>
          </div>
        </div>
        <RankGraph matches={seasonMatches} />
      </div>

      {/* ルール別勝率 */}
      <div className={card}>
        <h2 className="text-nord6 font-semibold mb-3">ルール別勝率</h2>
        <div className="space-y-2">
          {Object.entries(ruleStats).map(([rule, { wins, losses }]) => {
            const wr =
              wins + losses > 0
                ? Math.round((wins / (wins + losses)) * 100)
                : 0;
            return (
              <div key={rule} className="flex items-center gap-3">
                <span className={`${muted} w-24`}>{rule}</span>
                <div className="flex-1 h-2 bg-nord2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nord14 rounded-full"
                    style={{ width: `${wr}%` }}
                  />
                </div>
                <span className="text-nord6 text-sm w-10 text-right">
                  {wr}%
                </span>
                <span className="text-nord4 text-xs w-16 text-right">
                  {wins}W {losses}L
                </span>
              </div>
            );
          })}
          {Object.keys(ruleStats).length === 0 && (
            <p className={muted}>データなし</p>
          )}
        </div>
      </div>

      {/* マップ別勝率（上位5） */}
      <div className={card}>
        <h2 className="text-nord6 font-semibold mb-3">
          マップ別勝率（上位5）
        </h2>
        <div className="space-y-2">
          {top5Maps.map(([map, { wins, losses, total }]) => {
            const deciders = wins + losses;
            const wr =
              deciders > 0 ? Math.round((wins / deciders) * 100) : 0;
            return (
              <div key={map} className="flex items-center gap-3">
                <span className={`${muted} w-44 truncate`}>{map}</span>
                <div className="flex-1 h-2 bg-nord2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nord14 rounded-full"
                    style={{ width: `${wr}%` }}
                  />
                </div>
                <span className="text-nord6 text-sm w-10 text-right">
                  {wr}%
                </span>
                <span className="text-nord4 text-xs w-14 text-right">
                  {total}試合
                </span>
              </div>
            );
          })}
          {top5Maps.length === 0 && <p className={muted}>データなし</p>}
        </div>
      </div>

      {/* 直近10試合 */}
      <div className={card}>
        <h2 className="text-nord6 font-semibold mb-3">直近10試合</h2>
        <div className="space-y-0">
          {recent10.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 py-2.5 border-b border-nord2 last:border-0"
            >
              <span className="text-nord4 text-xs w-24 shrink-0">{m.date}</span>
              <span className="text-nord4 text-xs w-16 shrink-0">{m.rule}</span>
              <span className="text-nord6 text-sm flex-1 truncate min-w-0">
                {m.map}
              </span>
              <ResultBadge result={m.result} />
              <span className="text-nord6 text-xs w-24 text-right shrink-0">
                {rankLabel(m.rank)}
              </span>
              <MatchRowActions match={m} />
            </div>
          ))}
          {recent10.length === 0 && <p className={muted}>試合記録なし</p>}
        </div>
      </div>
    </div>
  );
}
