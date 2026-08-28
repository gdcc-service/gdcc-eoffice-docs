# gdcc-eoffice-docs

เอกสารคู่มือ e-Office สร้างด้วย [Fumadocs](https://fumadocs.dev) + Next.js  
ใช้ **pnpm** เป็น package manager

## เริ่มต้น

```bash
pnpm install
pnpm dev
```

เปิด http://localhost:3000

| คำสั่ง | คำอธิบาย |
| --- | --- |
| `pnpm dev` | รัน development server |
| `pnpm build` | build สำหรับ production |
| `pnpm start` | รัน production server |
| `pnpm lint` | ตรวจ ESLint |
| `pnpm types:check` | ตรวจ TypeScript |
| `pnpm security:check` | ตรวจ dependency vulnerabilities |

## รูปในคู่มือ (Media)

รูปของเอกสารเก็บใน `public/media/` ชื่อไฟล์เป็น UUID เช่น:

```mdx
![](/media/10b55fb1-1dd6-4771-87f4-069879e0aeef.png)
```

### ลบรูปที่ไม่ได้ใช้งาน

สคริปต์จะเทียบไฟล์ใน `public/media/` กับ path ที่ถูกอ้างใน `content/**/*.mdx`  
รูปที่ไม่มีในเอกสารจะถือว่าไม่ได้ใช้งาน

```bash
# ลิสต์รูปที่ไม่ได้ใช้ (ไม่ลบ)
pnpm media:prune

# ลบรูปที่ไม่ได้ใช้ออกจริง
pnpm media:prune:delete
```

แนะนำรัน `--dry-run` (`pnpm media:prune`) ก่อนทุกครั้ง แล้วค่อยใช้ `pnpm media:prune:delete`

## Explore

- `lib/source.ts`: content source adapter (`loader()`)
- `lib/layout.shared.tsx`: shared layout options
- `source.config.ts`: Fumadocs MDX config

| Route | Description |
| --- | --- |
| `app/(home)` | landing และหน้าทั่วไป |
| `app/docs` | documentation layout / pages |
| `app/api/search/route.ts` | search API |

อ่านเพิ่ม: [Fumadocs MDX](https://fumadocs.dev/docs/mdx) · [Next.js Docs](https://nextjs.org/docs)
