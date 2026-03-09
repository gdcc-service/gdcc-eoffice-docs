"use client";
import { usePathname } from "next/navigation";
import { useBreadcrumb } from "fumadocs-core/breadcrumb";
import type * as PageTree from "fumadocs-core/page-tree";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { menuIcons } from "../config";

export function Breadcrumb({ tree }: { tree: PageTree.Root }) {
  const pathname = usePathname();
  const items = useBreadcrumb(pathname, tree, {
    includeRoot: true,
    includeSeparator: true,
    includePage: true,
  });

  if (items.length === 0) return null;

  console.log(items);

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
