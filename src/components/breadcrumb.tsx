"use client";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type * as PageTree from "fumadocs-core/page-tree";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  getEOfficeMenu,
  getMenuIdFromName,
  adminIcon,
  userIcon,
} from "@/config";

export function Breadcrumb({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  const breadcrumb = useBreadcrumb(pathname, tree, {
    includeRoot: true,
    includeSeparator: true,
    includePage: true,
  });

  if (breadcrumb.length === 0) {
    return null;
  }

  // ถ้า root เป็น "Docs" ให้เอาออก
  const source =
    breadcrumb[0]?.name === "Docs" ? breadcrumb.slice(1) : breadcrumb;

  const items = source.map((item, index) => {
    // แสดง icon ถ้า items[0].name มีใน eOffice menu
    if (index === 0 && item.name && typeof item.name === "string") {
      const menuId = getMenuIdFromName(item.name);
      if (menuId) {
        const menu = getEOfficeMenu(menuId);
        const originalName = item.name;
        return {
          ...item,
          name: (
            <span
              className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring inset-ring-gray-400/20"
              style={{
                backgroundColor: menu.color + "1A", // 10% opacity
              }}
            >
              {menu.icon({ className: "inline mr-1 size-4" })}
              {originalName}
            </span>
          ),
          url: "/docs/" + menuId, // เปลี่ยน URL เป็น /docs/{menuId}
        };
      }
    }

    if (index === 1 && item.name === "สิทธิ์ผู้ดูแลระบบ (Admin)") {
      return {
        ...item,
        name: (
          <>
            {adminIcon}
            <span className="ml-1">{item.name}</span>
          </>
        ),
      };
    }

    if (index === 1 && item.name === "สิทธิ์ผู้ใช้งานทั่วไป (User)") {
      return {
        ...item,
        name: (
          <>
            {userIcon}
            <span className="ml-1">{item.name}</span>
          </>
        ),
      };
    }

    return item;
  });

  return (
    <div className="-mb-3 flex flex-row items-center gap-1 text-sm font-medium text-fd-muted-foreground">
      {items.map((item, i) => (
        <Fragment key={i}>
          {i !== 0 && (
            <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />
          )}
          {item.url ? (
            <Link
              href={item.url}
              className="truncate hover:text-fd-accent-foreground"
            >
              {item.name}
            </Link>
          ) : (
            <span className="truncate">{item.name}</span>
          )}
        </Fragment>
      ))}
    </div>
  );
}
