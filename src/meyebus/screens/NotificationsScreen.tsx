import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { StatusBar } from "../PhoneFrame";
import { Icon } from "../ui";

type Note = {
  icon: Parameters<typeof Icon>[0]["name"];
  tint: string;
  title: string;
  body: string;
  time: string;
};

const NOTES: Note[] = [
  { icon: "bus", tint: COLORS.blue, title: "Trajet démarré", body: "Le bus a quitté l’école Al Manar.", time: "8:05" },
  { icon: "pin", tint: COLORS.amber, title: "Bus en approche", body: "Aïcha arrive dans 5 minutes.", time: "8:27" },
  { icon: "check", tint: COLORS.green, title: "Bus arrivé", body: "Aïcha est bien arrivée à destination.", time: "8:32" },
  { icon: "home", tint: COLORS.navy, title: "Trajet terminé", body: "Bonne journée ! À ce soir pour le retour.", time: "8:33" },
];

const Row: React.FC<{ note: Note; index: number }> = ({ note, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6 - index * 9, fps, config: { damping: 16, mass: 0.8 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${(1 - s) * 40}px)`,
        background: COLORS.white,
        borderRadius: 24,
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 10px 26px rgba(14,42,71,0.07)",
      }}
    >
      <div style={{ width: 64, height: 64, borderRadius: 20, background: `${note.tint}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon name={note.icon} size={32} color={note.tint} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 26, fontWeight: 800, color: COLORS.text }}>{note.title}</span>
          <span style={{ fontSize: 19, color: COLORS.textMuted }}>{note.time}</span>
        </div>
        <div style={{ fontSize: 22, color: COLORS.textMuted, marginTop: 5 }}>{note.body}</div>
      </div>
    </div>
  );
};

export const NotificationsScreen: React.FC = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: "8px 36px 0" }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: COLORS.text, margin: "10px 4px 8px" }}>Notifications</div>
        <div style={{ fontSize: 22, color: COLORS.textMuted, margin: "0 4px 24px" }}>Aujourd’hui</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {NOTES.map((n, i) => (
            <Row key={n.title} note={n} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
