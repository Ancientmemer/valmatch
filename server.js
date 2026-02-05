import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const boys = [];
const girls = [];
const matches = new Map(); // userId -> matchedIG

// Create simple userId
const uid = () => Math.random().toString(36).slice(2);

// Join queue
app.post("/join", (req, res) => {
  const { gender, ig } = req.body;
  if (!gender || !ig) {
    return res.status(400).json({ ok: false });
  }

  const userId = uid();

  if (gender === "boy") {
    if (girls.length > 0) {
      const partner = girls.shift();
      matches.set(userId, partner.ig);
      matches.set(partner.userId, ig);
      return res.json({ ok: true, userId, matched: true });
    }
    boys.push({ userId, ig });
  } else if (gender === "girl") {
    if (boys.length > 0) {
      const partner = boys.shift();
      matches.set(userId, partner.ig);
      matches.set(partner.userId, ig);
      return res.json({ ok: true, userId, matched: true });
    }
    girls.push({ userId, ig });
  }

  res.json({ ok: true, userId, matched: false });
});

// Poll for match
app.get("/status/:id", (req, res) => {
  const { id } = req.params;
  if (matches.has(id)) {
    const ig = matches.get(id);
    matches.delete(id); // one-time reveal
    return res.json({ matched: true, ig });
  }
  res.json({ matched: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("💘 ValMatch running on", PORT));
