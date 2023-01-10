import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { notification } from "antd";

export interface NotificationHandles {
  openMyNotification: (type?: "sucess" | "error", description?: string) => {};
}

const Notification: React.ForwardRefRenderFunction<NotificationHandles> = (
  props,
  ref
) => {
  const [openNotification, setOpenNotification] = useState(false);

  const [api, contextHolder] = notification.useNotification();
  const [typeNotification, setTypeNotification] = useState<string>("");
  const [descriptionNotification, setDescriptionNotification] =
    useState<string>("");

  const openMyNotification = useCallback(
    (type: string, description: string) => {
      setTypeNotification(type);
      setDescriptionNotification(description);
      setOpenNotification(true);
    },
    []
  );

  const closeMyNotification = useCallback(() => {
    setOpenNotification(false);
  }, []);

  useImperativeHandle(ref, (): any => {
    return {
      openMyNotification,
    };
  });

  useEffect(() => {
    if (openNotification) {
      if (typeNotification === "error") {
        api.error({
          message: `Notification`,
          description: descriptionNotification,
          placement: "topRight",
        });
      } else {
        api.success({
          message: `Notification`,
          description: descriptionNotification,
          placement: "topRight",
        });
      }
      closeMyNotification();
    }
  }, [openNotification]);

  return <div>{contextHolder}</div>;
};

export default forwardRef(Notification);
