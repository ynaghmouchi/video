import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { StatusBar } from "../PhoneFrame";
import { Avatar, Icon } from "../ui";

const Reveal: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.7 } });
  return (
    <div style={{ opacity: s, transform: `translateY(${(1 - s) * 26}px)` }}>{children}</div>
  );
};

const QuickAction: React.FC<{ icon: Parameters<typeof Icon>[0]["name"]; label: string; delay: number; tint: string }> = ({ icon, label, delay, tint }) => (
  <Reveal delay={delay}>
    <div
      style={{
        background: COLORS.white,
        borderRadius: 22,
        padding: "26px 18px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 10px 26px rgba(14,42,71,0.07)",
      }}
    >
      <div style={{ width: 66, height: 66, borderRadius: 20, background: `${tint}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={32} color={tint} />
      </div>
      <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.text }}>{label}</span>
    </div>
  </Reveal>
);

export const HomeScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: "10px 36px" }}>
        {/* Header card */}
        <Reveal delay={2}>
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.navy})`,
              borderRadius: 28,
              padding: "32px 30px",
              color: "#fff",
              boxShadow: `0 22px 44px ${COLORS.blue}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 22, opacity: 0.85, fontWeight: 600 }}>Bonjour,</div>
              <div style={{ fontSize: 40, fontWeight: 800, marginTop: 4 }}>Mr Omar</div>
              <div style={{ fontSize: 21, opacity: 0.8, marginTop: 6 }}>Espace Parent</div>
            </div>
            <div style={{ width: 84, height: 84, borderRadius: 26, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="user" size={44} color="#fff" />
            </div>
          </div>
        </Reveal>

        {/* Mes enfants */}
        <Reveal delay={10}>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, margin: "30px 4px 16px" }}>Mes enfants</div>
        </Reveal>
        <Reveal delay={14}>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 24,
              padding: 24,
              display: "flex",
              alignItems: "center",
              gap: 20,
              boxShadow: "0 12px 30px rgba(14,42,71,0.08)",
            }}
          >
            <Avatar initials="AB" size={76} bg={COLORS.orange} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>Aïcha Benali</div>
              <div style={{ fontSize: 21, color: COLORS.textMuted, marginTop: 4 }}>École Al Manar • Bus 12</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: COLORS.greenSoft,
                color: COLORS.green,
                fontWeight: 800,
                fontSize: 20,
                padding: "10px 16px",
                borderRadius: 14,
              }}
            >
              <span style={{ width: 11, height: 11, borderRadius: 11, background: COLORS.green, opacity: 0.4 + 0.6 * pulse }} />
              En route
            </div>
          </div>
        </Reveal>

        {/* Actions rapides */}
        <Reveal delay={20}>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text, margin: "32px 4px 16px" }}>Actions rapides</div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <QuickAction icon="pin" label="Localiser" delay={24} tint={COLORS.blue} />
          <QuickAction icon="bell" label="Notifications" delay={28} tint={COLORS.orange} />
          <QuickAction icon="history" label="Historique" delay={32} tint={COLORS.green} />
          <QuickAction icon="user" label="Profil" delay={36} tint={COLORS.navy} />
        </div>
      </div>
    </div>
  );
};
