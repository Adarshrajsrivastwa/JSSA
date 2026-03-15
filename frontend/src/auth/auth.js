const AUTH_STORAGE_KEY = "jssa_auth";

/**
 * @typedef {"admin" | "applicant"} Role
 * @typedef {{ identifier: string, role: Role, token: string, loginAt: number }} AuthSession
 */

/**
 * @returns {AuthSession | null}
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      (parsed.role !== "admin" && parsed.role !== "applicant") ||
      typeof parsed.identifier !== "string" ||
      !parsed.token
    ) {
      return null;
    }
    return /** @type {AuthSession} */ (parsed);
  } catch {
    return null;
  }
}

/**
 * @param {{ identifier: string, role: Role, token: string }} session
 */
export function setSession(session) {
  const payload = {
    identifier: session.identifier,
    role: session.role,
    token: session.token,
    loginAt: Date.now(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event("jssa_auth_changed"));
}

export function clearSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("jssa_auth_changed"));
}

/**
 * @param {Role | undefined} role
 */
export function roleHomePath(role) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "applicant") return "/applicant/dashboard";
  return "/";
}
