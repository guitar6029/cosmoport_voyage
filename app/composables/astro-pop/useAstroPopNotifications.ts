export type AstroPopNotificationType = "success" | "error" | "info";

export interface AstroPopNotification {
  id: string;
  type: AstroPopNotificationType;
}

const DURATION_DEFAULT_MS = 4500;

const timers = new Map<string, ReturnType<typeof setTimeout>>();

export function useAstroPopNotifications() {
  const notifications = useState<AstroPopNotification[]>(
    "astro-pop-notifications",
    () => [],
  );

  function dismiss(id: string) {
    const timer = timers.get(id);

    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }

    notifications.value = notifications.value.filter(
      (notification) => notification.id !== id,
    );
  }

  function show(
    type: AstroPopNotificationType,
    duration = DURATION_DEFAULT_MS,
  ) {
    if (import.meta.server) {
      return;
    }

    const id = crypto.randomUUID();

    notifications.value.push({ id, type });

    if (duration > 0) {
      const timer = setTimeout(() => {
        dismiss(id);
      }, duration);

      timers.set(id, timer);
    }

    return id;
  }

  return {
    notifications,
    show,
    dismiss,
  };
}
