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
    completed:       <CheckCircle2 className="h-3.5 w-3.5 text-accent" />,
    failed:          <XCircle className="h-3.5 w-3.5 text-red-500" />,
    proof_submitted: <Clock className="h-3.5 w-3.5 text-amber-600" />,
  }[s] ?? <Target className="h-3.5 w-3.5 text-muted" />);

  const filtered = (challenges.data?.challenges ?? []).filter(c =>
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())) &&
    (filter === "all" || c.status === filter)
  );

  const tabs = [
    { val: "all" as const, label: "All" },
    { val: "active" as const, label: "Active" },
    { val: "proof_submitted" as const, label: "Submitted" },
    { val: "completed" as const, label: "Done" },
    { val: "failed" as const, label: "Forfeited" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="heading text-xl text-fg">Active Goals</h2>
        <Button asChild className="text-xs h-9 px-4 rounded-xl shadow-soft">
          <Link to="/create">New Goal</Link>
        </Button>
      </div>

      {/* Filter bar */}
      <Card className="p-3 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <Input placeholder="Search…" className="pl-8 text-xs py-2" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {tabs.map(({ val, label }) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                filter === val ? "border-accent bg-accent/8 text-accent" : "border-border text-muted hover:text-fg"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* Grid */}
      {challenges.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-44 animate-pulse bg-stone-100 rounded-xl" />)}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(c => {
            const pct = c.verificationThreshold > 0 ? Math.min(100, Math.round(c.approvedVotes / c.verificationThreshold * 100)) : 0;
            return (
              <Card key={c._id} className="p-5 flex flex-col justify-between card-hover">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <Badge>{c.category}</Badge>
                    <div className="flex items-center gap-1.5">
                      {statusIcon(c.status)}
                      <span className="text-[10px] font-semibold text-muted capitalize">{c.status.replaceAll("_"," ")}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-fg line-clamp-1">{c.title}</h3>
                </div>
                <div className="mt-4 space-y-3 pt-3 border-t border-border">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted font-mono">
                      <span>Votes</span><span>{c.approvedVotes}/{c.verificationThreshold}</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-accent">{c.stakeAmount} XLM</span>
                    <Button asChild className="text-[10px] h-8 px-3 rounded-lg shadow-soft">
                      <Link to={`/challenge/${c._id}`}>View <ChevronRight className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex min-h-[220px] flex-col items-center justify-center text-center border-dashed">
          <p className="text-sm font-semibold text-fg">No goals found</p>
          <Button asChild className="mt-3 text-xs h-9 px-4 rounded-xl shadow-soft">
            <Link to="/create">Create one</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
