"use client";

import { useCallback, useEffect, useState } from "react";
import { ClipboardCheck, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MemberAvatar } from "@/components/member-avatar";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import type { Attendance, Member } from "@/lib/types";
import { apiJson, getErrorMessage } from "@/lib/api-client";
import { ErrorBanner } from "@/components/error-banner";
import { useLanguage } from "@/components/language-provider";

export default function AttendancePage() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<Attendance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState<"error" | "success">("success");
  const [pageError, setPageError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [historyData, mems] = await Promise.all([
        apiJson<Attendance[]>("/api/attendance"),
        apiJson<Member[]>("/api/members?search="),
      ]);
      setHistory(historyData);
      setMembers(mems.filter((m) => m.status === "active"));
    } catch (err) {
      setHistory([]);
      setMembers([]);
      setPageError(getErrorMessage(err, t("errorLoadAttendance")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCheckIn() {
    if (!selectedMember) return;
    setCheckingIn(true);
    setMessage("");
    try {
      const data = await apiJson<Attendance & { member?: Member }>("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: selectedMember }),
      });
      const name = (data.member as Member)?.name ?? t("unknown");
      setMessageVariant("success");
      setMessage(`✓ ${t("checkInSuccess", { name })}`);
      setSelectedMember("");
      load();
    } catch (err) {
      setMessageVariant("error");
      setMessage(getErrorMessage(err));
    } finally {
      setCheckingIn(false);
    }
  }

  const todayCount = history.filter((a) => {
    const d = new Date(a.check_in);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <>
      <PageHeader title={t("attendanceTitle")} subtitle={t("attendanceSubtitle")} />
      <div className="p-4 lg:p-6 space-y-6">
        {pageError && (
          <ErrorBanner message={pageError} onDismiss={() => setPageError("")} />
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/30">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t("checkInsToday")}</p>
              <p className="text-3xl font-bold text-primary">{todayCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              {t("quickCheckIn")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectActiveMember")} />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full h-12 text-base"
              onClick={handleCheckIn}
              disabled={checkingIn || !selectedMember}
            >
              {checkingIn ? t("checkingIn") : t("checkIn")}
            </Button>
            {message && (
              <ErrorBanner
                message={message}
                variant={messageVariant}
                onDismiss={() => setMessage("")}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("attendanceHistory")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <p className="p-4 text-sm text-muted-foreground">{t("loading")}</p>
            ) : history.length === 0 ? (
              <EmptyState icon={ClipboardCheck} title={t("noCheckIns")} />
            ) : (
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {history.map((a) => (
                  <AttendanceRow key={a.id} attendance={a} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function AttendanceRow({ attendance }: { attendance: Attendance }) {
  const { t } = useLanguage();
  const member = attendance.member as Member | undefined;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {member && (
        <MemberAvatar name={member.name} photoUrl={member.photo_url} size="sm" />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{member?.name ?? t("unknown")}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(attendance.check_in)}</p>
      </div>
    </div>
  );
}
