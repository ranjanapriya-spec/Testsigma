# BDR Flow

A lightweight workflow console built around the BDR to AE flow:

- BDR completes intro call.
- Gong recording is captured.
- AI generates SDR notes, missing details, suggested questions, and qualification readiness.
- Output is pushed to CRM and Slack.
- 24h BDR reminders drive MoM and CRM updates.
- Complete details move to demo; missing details loop back to BDR follow-up.
- AE accepts or rejects after demo.
- Rejections can be contested and routed to BDR manager decision.

## Run

```bash
npm start
```

Open:

```text
http://127.0.0.1:3000
```

The app stores workflow state in browser localStorage so it works as a quick prototype without a database.
