"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: NotificationType;
    id: number;
  } | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    const id = Date.now();
    setNotification({
      message,
      type,
      id,
    });

    //clearing current notification after 3 sec
    setTimeout(() => {
      setNotification((current) => (current?.id === id ? null : current));
    }, 3000);
  };
  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="toast toast-bottom toast-end z-[100]">
          <div className={`alert ${getAlertClass(notification.type)}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function getAlertClass (type : NotificationType) : string {
    switch (type) {
        case "success":
            return "alert-success"; 
            break;
        case "warning":
            return "alert-warning";
            break;
        case "error":
            return "alert-error";
            break;
        case "info":
            return "alert-info";
            break;
        default:
            return "alert-info";
            break;
    }
}

export function useNotification(){
    let context = useContext(NotificationContext);

    if(context === undefined){
        throw new Error("useNotification must be used within notification provider");
    }
    return context;
}
