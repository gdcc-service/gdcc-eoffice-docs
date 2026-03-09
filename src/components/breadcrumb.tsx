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
  const items = useBreadcrumb(pathname, tree, {
    includeRoot: true,
    includeSeparator: true,
    includePage: true,
  });

  if (items.length === 0) {
    return null;
  }

  if (items[0]?.name === "Docs") {
    // ถ้า root เป็น "Docs" ให้เอาออก
    items.shift();
  }

  // แสดง icon ถ้า items[0].name มีใน eOffice menu
  if (items.length > 0 && items[0]?.name && typeof items[0].name === "string") {
    const menuId = getMenuIdFromName(items[0].name);
    if (menuId) {
      const menu = getEOfficeMenu(menuId);
      const originalName = items[0].name;
      items[0].name = (
        <span
          className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium inset-ring inset-ring-gray-400/20"
          style={{
            backgroundColor: menu.color + "1A", // 10% opacity
          }}
        >
          {menu.icon({ className: "inline mr-1 size-4" })}
          {originalName}
        </span>
      );
      items[0].url = "/docs/" + menuId; // เปลี่ยน URL เป็น /docs/{menuId}
    }
  }

  if (items[1]?.name === "สิทธิ์ผู้ดูแลระบบ (Admin)") {
    items[1].name = (
      <>
        {adminIcon}
        <span className="ml-1">{items[1].name}</span>
      </>
    );
  }

  if (items[1]?.name === "สิทธิ์ผู้ใช้งานทั่วไป (User)") {
    items[1].name = (
      <>
        {userIcon}
        <span className="ml-1">{items[1].name}</span>
      </>
    );
  }

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
