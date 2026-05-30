import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../theme";
import { StatusBar, INNER_W } from "../PhoneFrame";
import { LogoMark, Wordmark } from "../Logo";
import { Icon } from "../ui";

const Field: React.FC<{
  icon: "mail" | "lock";
  value: React.ReactNode;
  focused?: boolean;
}> = ({ icon, value, focused }) => (
  <div
    style={{
      height: 76,
      borderRadius: 18,
      background: COLORS.white,
      border: `2px solid ${focused ? COLORS.blue : COLORS.line}`,
      boxShadow: focused ? `0 8px 24px ${COLORS.blue}22` : "none",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 22px",
      fontSize: 26,
      color: COLORS.text,
    }}
  >
    <Icon name={icon} size={26} color={focused ? COLORS.blue : COLORS.textMuted} />
    {value}
  </div>
);

export const LoginScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const email = "parent@meyebus.com";
  const typed = Math.floor(interpolate(frame, [12, 46], [0, email.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const emailText = email.slice(0, typed);
  const emailFocused = frame >= 10 && frame < 52;
  const pwdCount = Math.floor(interpolate(frame, [54, 74], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const pwdFocused = frame >= 52 && frame < 86;
  const btnPress = interpolate(frame, [92, 100, 110], [1, 0.96, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnGlow = interpolate(frame, [88, 104], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cursor = frame % 30 < 15 ? "|" : " ";

  return (
    <div style={{ width: "100%", height: "100%", background: COLORS.bg }}>
      <StatusBar />
      <div style={{ padding: "0 44px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ marginTop: 80, filter: "drop-shadow(0 18px 30px rgba(14,42,71,0.18))" }}>
          <LogoMark size={150} />
        </div>
        <div style={{ marginTop: 18 }}>
          <Wordmark size={56} />
        </div>
        <div style={{ marginTop: 8, fontSize: 24, color: COLORS.textMuted, fontWeight: 600 }}>
          Espace Parent
        </div>

        <div style={{ width: "100%", marginTop: 56, display: "flex", flexDirection: "column", gap: 20 }}>
          <Field
            icon="mail"
            focused={emailFocused}
            value={
              <span style={{ color: emailText ? COLORS.text : COLORS.textMuted }}>
                {emailText || "Adresse e-mail"}
                {emailFocused ? <span style={{ color: COLORS.blue }}>{cursor}</span> : null}
              </span>
            }
          />
          <Field
            icon="lock"
            focused={pwdFocused}
            value={
              <span style={{ letterSpacing: 6, color: COLORS.text }}>
                {pwdCount > 0 ? "●".repeat(pwdCount) : <span style={{ color: COLORS.textMuted, letterSpacing: 0 }}>Mot de passe</span>}
                {pwdFocused ? <span style={{ color: COLORS.blue, letterSpacing: 0 }}>{cursor}</span> : null}
              </span>
            }
          />

          <div
            style={{
              transform: `scale(${btnPress})`,
              height: 80,
              marginTop: 14,
              borderRadius: 18,
              background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 ${10 + btnGlow * 12}px ${24 + btnGlow * 22}px ${COLORS.blue}${btnGlow > 0.5 ? "66" : "33"}`,
            }}
          >
            Se connecter
          </div>
          <div style={{ textAlign: "center", marginTop: 6, fontSize: 22, color: COLORS.textMuted }}>
            Vous n’êtes pas encore connecté ?
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 38, width: INNER_W, textAlign: "center", fontSize: 20, color: COLORS.textMuted }}>
        Connexion sécurisée
      </div>
    </div>
  );
};
