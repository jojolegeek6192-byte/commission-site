import { formatMoney } from "./validations";
import type { Currency } from "@prisma/client";

type NewCommissionPayload = {
  id: string;
  projectName: string;
  discordUser: string;
  amount: number;
  currency: Currency;
  deadline: Date;
  urgent: boolean;
};

// Fire-and-forget Discord webhook. Never throws — a notification failure
// must never block a commission from being saved.
export async function notifyDiscord(commission: NewCommissionPayload) {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return;

  const body = {
    embeds: [
      {
        title: commission.urgent
          ? "🚨 New URGENT Commission"
          : "📥 New Commission Submitted",
        color: commission.urgent ? 0xff3b3b : 0x00ff88,
        fields: [
          { name: "Project", value: commission.projectName, inline: true },
          { name: "Client", value: commission.discordUser, inline: true },
          {
            name: "Price",
            value: formatMoney(commission.amount, commission.currency),
            inline: true,
          },
          {
            name: "Deadline",
            value: new Date(commission.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            inline: true,
          },
          { name: "Urgent", value: commission.urgent ? "Yes" : "No", inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: `Commission ID: ${commission.id}` },
      },
    ],
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[notifyDiscord] failed:", err);
  }
}

// Optional email notification via Resend. No-op if RESEND_API_KEY is unset,
// so email is entirely optional and the app works fine without it.
export async function notifyEmail(commission: NewCommissionPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  if (!apiKey || !to) return;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_EMAIL_FROM || "Commissions <onboarding@resend.dev>",
        to: [to],
        subject: `${commission.urgent ? "[URGENT] " : ""}New commission: ${commission.projectName}`,
        html: `
          <h2>New commission submitted</h2>
          <p><b>Project:</b> ${commission.projectName}</p>
          <p><b>Client (Discord):</b> ${commission.discordUser}</p>
          <p><b>Price:</b> ${formatMoney(commission.amount, commission.currency)}</p>
          <p><b>Deadline:</b> ${new Date(commission.deadline).toLocaleDateString()}</p>
          <p><b>Urgent:</b> ${commission.urgent ? "Yes" : "No"}</p>
        `,
      }),
    });
  } catch (err) {
    console.error("[notifyEmail] failed:", err);
  }
}
