import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";

export type menuName =
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

export const menuColors: Record<menuName, string> = {
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
};

export const menuIcons: Record<menuName, React.JSX.Element> = {
  portal: (
    <FontAwesomeIcon icon={faHouse} style={{ color: menuColors.portal }} />
  ),
  "admin-tools": (
    <FontAwesomeIcon
      icon={faScrewdriverWrench}
      style={{ color: menuColors["admin-tools"] }}
    />
  ),
  draft: (
    <FontAwesomeIcon icon={faFirstdraft} style={{ color: menuColors.draft }} />
  ),
  saraban: (
    <FontAwesomeIcon icon={faBook} style={{ color: menuColors.saraban }} />
  ),
  "in-tray": (
    <FontAwesomeIcon
      icon={faFileSignature}
      style={{ color: menuColors["in-tray"] }}
    />
  ),
  news: (
    <FontAwesomeIcon icon={faNewspaper} style={{ color: menuColors.news }} />
  ),

  "room-booking": (
    <FontAwesomeIcon
      icon={faChalkboardUser}
      style={{ color: menuColors["room-booking"] }}
    />
  ),
  "car-reservation": (
    <FontAwesomeIcon
      icon={faVanShuttle}
      style={{ color: menuColors["car-reservation"] }}
    />
  ),
  emeeting: (
    <FontAwesomeIcon icon={faUsers} style={{ color: menuColors.emeeting }} />
  ),
  drive: (
    <FontAwesomeIcon
      icon={faCloudArrowDown}
      style={{ color: menuColors.drive }}
    />
  ),
};
