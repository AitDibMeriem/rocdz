import { Router } from "express";
import crypto from "crypto";

const router = Router();

const ACCOUNTS: Record<string, { password: string; role: "admin" | "super_admin"; displayName: string }> = {
  rocdz2026: { password: "r0c@dz", role: "admin", displayName: "Admin" },
  superroc: { password: "P@$$w0rd2026", role: "super_admin", displayName: "Super Admin" },
};

const sessions = new Map<string, { username: string; role: string; displayName: string; expiresAt: number }>();

router.post("/login", (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const account = ACCOUNTS[username];
  if (!account || account.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = crypto.randomUUID();
  sessions.set(token, {
    username,
    role: account.role,
    displayName: account.displayName,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  res.json({ token, role: account.role, username, displayName: account.displayName });
});

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    res.status(401).json({ error: "Session expired" });
    return;
  }
  res.json({ username: session.username, role: session.role, displayName: session.displayName });
});

router.post("/logout", (req, res) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    sessions.delete(auth.slice(7));
  }
  res.json({ ok: true });
});

export default router;
