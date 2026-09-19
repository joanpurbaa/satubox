import { ensureCatalogSeeded } from "@/lib/catalog";
import { corsJson, corsHeaders } from "@/lib/ext-api";

export async function GET() {
  const cat = await ensureCatalogSeeded();
  const flat = cat
    .filter((a) => a.domains.length > 0)
    .flatMap((a) =>
      a.domains.map((domain) => ({
        domain,
        name: a.name,
        icon: a.icon,
        cat: a.cat,
        ...(a.enabled ? {} : { deleted: true }),
      }))
    );
  return corsJson({ ok: true, apps: flat });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}