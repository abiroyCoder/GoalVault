import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Card, Button, Input, Badge, Progress } from "../components/ui";
import { Search, Trophy, Clock, CheckCircle2, XCircle, ChevronRight, Target } from "lucide-react";

export function ActiveChallengesPage({ completedOnly }: { completedOnly?: boolean }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all"|"active"|"proof_submitted"|"completed"|"failed">(completedOnly ? "completed" : "all");
  const challenges = useQuery({ queryKey: ["challenges"], queryFn: api.challenges });

  const statusIcon = (s: string) => ({
    completed:       <CheckCircle2 className="h-3.5 w-3.5 text-[#3D9E6A]" />,
    failed:          <XCircle className="h-3.5 w-3.5 text-[#C0392B]" />,
    proof_submitted: <Clock className="h-3.5 w-3.5 text-[#D4872A]" />,
  }[s] ?? <Target className="h-3.5 w-3.5 text-[#8A8475]" />);

  const statusColor = (s: string) => ({
    completed:       "border-[#3D9E6A]/30 bg-[#3D9E6A]/10 text-[#3D9E6A]",
    failed:          "border-[#C0392B]/30 bg-[#C0392B]/10 text-[#C0392B]",
    proof_submitted: "border-[#D4872A]/30 bg-[#D4872A]/10 text-[#D4872A]",
    active:          "border-[#2E2C28] bg-[#232118] text-[#8A8475]",
  }[s] ?? "border-[#2E2C28] text-[#8A8475]");

  const filtered = (challenges.data?.challenges ?? []).filter(c =>
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || c.status === filter)
  );

  const tabs: { val: "all"|"active"|"proof_submitted"|"completed"|"failed"; label: string }[] = [
    { val: "all",            label: "All"       },
    { val: "active",         label: "Active"    },
    { val: "proof_submitted",label: "Submitted" },
    { val: "completed",      label: "Done"      },
    { val: "failed",         label: "Forfeited" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
            className="text-2xl text-[#F2EDDE]">
            {completedOnly ? "Completed Goals" : "Goals"}
          </h1>
          <p className="text-xs text-[#8A8475] mt-1">Your on-chain accountability commitments</p>
        </div>
        <Button asChild className="text-xs h-9 px-4 rounded-xl">
          <Link to="/create">+ New Goal</Link>
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-3 flex flex-col sm:flex-row gap-3 items-center border-[#2E2C28] bg-[#1A1916]">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8A8475]" />
          <Input placeholder="Search goals…" className="pl-8 text-xs py-2" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {tabs.map(({ val, label }) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === val
                  ? "border-[#D4872A]/40 bg-[#D4872A]/12 text-[#D4872A]"
                  : "border-[#2E2C28] text-[#8A8475] hover:text-[#F2EDDE] hover:bg-[#232118]"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Goal grid */}
      {challenges.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-44 animate-pulse bg-[#1A1916] rounded-2xl border border-[#2E2C28]" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => {
            const pct = c.verificationThreshold > 0 ? Math.min(100, Math.round(c.approvedVotes / c.verificationThreshold * 100)) : 0;
            return (
              <Card key={c._id} className="p-5 flex flex-col justify-between bg-[#1A1916] border-[#2E2C28] card-hover">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Badge className="text-[#D4872A] border-[#D4872A]/25 bg-[#D4872A]/10">{c.category}</Badge>
                    <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusColor(c.status)}`}>
                      {statusIcon(c.status)}
                      <span className="capitalize">{c.status.replaceAll("_"," ")}</span>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
                    className="text-sm text-[#F2EDDE] line-clamp-1">{c.title}</h3>
                </div>
                <div className="mt-4 space-y-3 pt-3 border-t border-[#2E2C28]">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-[#8A8475] font-mono">
                      <span>Votes</span><span>{c.approvedVotes}/{c.verificationThreshold}</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                      className="text-sm text-[#D4872A]">{c.stakeAmount} XLM</span>
                    <Button asChild className="text-[10px] h-8 px-3 rounded-lg">
                      <Link to={`/challenge/${c._id}`}>View <ChevronRight className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex min-h-[220px] flex-col items-center justify-center text-center border-dashed border-[#2E2C28] bg-[#1A1916]">
          <Trophy className="h-8 w-8 text-[#2E2C28] mb-3" />
          <p className="text-sm font-semibold text-[#F2EDDE]">No goals found</p>
          <p className="text-xs text-[#8A8475] mt-1">Create your first goal to get started</p>
          <Button asChild className="mt-4 text-xs h-9 px-5 rounded-xl">
            <Link to="/create">Create Goal</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
