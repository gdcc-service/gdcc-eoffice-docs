import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faFirstdraft } from "@fortawesome/free-brands-svg-icons";
import {
  faHouse,
  faScrewdriverWrench,
  faBook,
  faFileSignature,
  faNewspaper,
  faChalkboardUser,
  faVanShuttle,
  faUsers,
  faCloudArrowDown,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type MenuId =
  | "portal"
  | "admin-tools"
  | "draft"
  | "saraban"
  | "in-tray"
  | "news"
  | "room-booking"
  | "car-reservation"
  | "emeeting"
  | "drive"; // Archive;

export const menuColors: Record<MenuId, string> = {
  portal: "#177fff",
  "admin-tools": "#fecb3e",
  draft: "#fd7e14",
  saraban: "#ff8080",
  "in-tray": "#c68357",
  news: "#a3de6e",
  "room-booking": "#eb729d",
  "car-reservation": "#0e75b5",
  emeeting: "#e43b79",
  drive: "#02c7fc",
} as const;

const iconDefinitions: Record<MenuId, IconDefinition> = {
  portal: faHouse,
  "admin-tools": faScrewdriverWrench,
  draft: faFirstdraft,
  saraban: faBook,
  "in-tray": faFileSignature,
  news: faNewspaper,
  "room-booking": faChalkboardUser,
  "car-reservation": faVanShuttle,
  emeeting: faUsers,
  drive: faCloudArrowDown,
} as const;

export const getMenuIcon = (
  menuId: MenuId,
  props?: Omit<FontAwesomeIconProps, "icon">,
): React.JSX.Element => (
  <FontAwesomeIcon
    icon={iconDefinitions[menuId]}
    style={{ color: menuColors[menuId], ...props?.style }}
    {...props}
  />
);

export const getMenuIdByName: Record<string, MenuId> = {
  Portal: "portal",
  "Admin Tools": "admin-tools",
  Draft: "draft",
  "e-Saraban": "saraban",
  "In-tray": "in-tray",
  eMeeting: "emeeting",
  "Car Reservation": "car-reservation",
  "Room Booking": "room-booking",
  Archive: "drive",
  News: "news",
};

// Utility functions
export const getMenuIdFromName = (name: string): MenuId | undefined => {
  return getMenuIdByName[name];
};

export const getMenuColor = (menuId: MenuId): string => {
  return menuColors[menuId];
};

export const getMenuIconDef = (menuId: MenuId): IconDefinition => {
  return iconDefinitions[menuId];
};

// รองรับทั้ง MenuId และ name
export const getEOfficeMenu = (idOrName: string) => {
  const menuId = (getMenuIdByName[idOrName] ?? idOrName) as MenuId;

  return {
    id: menuId,
    color: menuColors[menuId],
    iconDef: iconDefinitions[menuId],
    icon: (props?: Omit<FontAwesomeIconProps, "icon">) =>
      getMenuIcon(menuId, props),
  };
};

export const adminIcon = (
  <FontAwesomeIcon icon={faToggleOn} style={{ color: "#d3217e" }} />
);
export const userIcon = (
  <FontAwesomeIcon icon={faToggleOff} style={{ color: "#2596be" }} />
);
