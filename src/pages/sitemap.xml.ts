import { getCollection } from 'astro:content';
export async function GET() {
  const site='https://www.tesszhaolcsw.com';
  const fixed=['/','/about.html','/psychotherapy.html','/insurance-and-fees.html','/psychotherapy-cn.html','/insurance-cn.html','/privacy-policy.html','/hippa.html','/blog/','/zh/blog/'];
  const en=(await getCollection('blogEn',({data})=>!data.draft)).map(p=>`/blog/${p.id.replace(/\.(md|mdx)$/,'')}/`);
  const zh=(await getCollection('blogZh',({data})=>!data.draft)).map(p=>`/zh/blog/${p.id.replace(/\.(md|mdx)$/,'')}/`);
  const urls=[...fixed,...en,...zh].map(path=>`<url><loc>${site}${path}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
