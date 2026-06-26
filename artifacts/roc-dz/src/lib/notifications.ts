export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "rocdz_notifications";
export const NOTIFICATIONS_EVENT = "rocdz_notifications_update";

export function getNotifications(): Notification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addNotification(title: string, message: string) {
  const list = getNotifications();
  list.unshift({
    id: Date.now().toString(),
    title,
    message,
    timestamp: Date.now(),
    read: false,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
}

export function markAllRead() {
  const list = getNotifications();
  list.forEach((n) => { n.read = true; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
}

export function getUnreadCount(): number {
  return getNotifications().filter((n) => !n.read).length;
}
