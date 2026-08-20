import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/logo.png" alt="Logo" width={50} height={32} />
          {appName}
        </>
      ),
      url: "/docs",
    },

    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
