import { Router } from "express";
import crypto from "crypto";

const router = Router();

const ACCOUNTS: Record<string, { password: string; role: "admin" | "super_admin"; displayName: string }> = {
  rocdz2026: { password: "r0c@dz", role: "admin", displayName: "Admin" },
  superroc: { password: "P@$$w0rd2026", role: "super_admin", displayName: "Super Admin" },
};

const sessions = new Map<string, { username: string; role: string; displayName: string; expiresAt: number }>();

function getSession(req: any) {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) { sessions.delete(token); return null; }
  return session;
}

router.post("/login", (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  const account = ACCOUNTS[username];
  if (!account || account.password !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = crypto.randomUUID();
  sessions.set(token, { username, role: account.role, displayName: account.displayName, expiresAt: Date.now() + 24 * 60 * 60 * 1000 });
  res.json({ token, role: account.role, username, displayName: account.displayName });
});

router.get("/me", (req, res) => {
  const session = getSession(req);
  if (!session) { res.status(401).json({ error: "Unauthorized" }); return; }
  res.json({ username: session.username, role: session.role, displayName: session.displayName });
});

router.post("/logout", (req, res) => {
  const auth = req.headers.authorization as string | undefined;
  if (auth?.startsWith("Bearer ")) sessions.delete(auth.slice(7));
  res.json({ ok: true });
});

router.get("/admins", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "super_admin") { res.status(403).json({ error: "Super admin only" }); return; }
  const list = Object.entries(ACCOUNTS).map(([username, acc]) => ({ username, displayName: acc.displayName, role: acc.role }));
  res.json(list);
});

router.post("/admins", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "super_admin") { res.status(403).json({ error: "Super admin only" }); return; }
  const { username, password, displayName, role } = req.body as { username: string; password: string; displayName?: string; role?: string };
  if (!username || !password) { res.status(400).json({ error: "Nom d'utilisateur et mot de passe sont requis" }); return; }
  if (ACCOUNTS[username]) { res.status(409).json({ error: "Ce nom d'utilisateur existe déjà" }); return; }
  const safeRole: "admin" = "admin";
  ACCOUNTS[username] = { password, role: safeRole, displayName: displayName || username };
  res.json({ ok: true, username, role: safeRole, displayName: displayName || username });
});

router.patch("/admins/:username", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "super_admin") { res.status(403).json({ error: "Super admin only" }); return; }
  const { username } = req.params;
  const { password, displayName } = req.body as { password?: string; displayName?: string };
  if (!ACCOUNTS[username]) { res.status(404).json({ error: "Compte introuvable" }); return; }
  if (password) ACCOUNTS[username].password = password;
  if (displayName) ACCOUNTS[username].displayName = displayName;
  res.json({ ok: true });
});

router.delete("/admins/:username", (req, res) => {
  const session = getSession(req);
  if (!session || session.role !== "super_admin") { res.status(403).json({ error: "Super admin only" }); return; }
  const { username } = req.params;
  if (username === "superroc") { res.status(400).json({ error: "Impossible de supprimer le compte Super Admin principal" }); return; }
  if (!ACCOUNTS[username]) { res.status(404).json({ error: "Compte introuvable" }); return; }
  delete ACCOUNTS[username];
  res.json({ ok: true });
});

export default router;
