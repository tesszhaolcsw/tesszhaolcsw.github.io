import { getCollection } from 'astro:content';
export async function GET() {
  const site = 'https://www.tesszhaolcsw.com';
  const posts = (await getCollection('blogZh', ({data}) => !data.draft)).sort((a,b)=>b.data.date.valueOf()-a.data.date.valueOf());
  const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]!));
  const items=posts.map(p=>`<item><title>${esc(p.data.title)}</title><link>${site}/zh/blog/${p.id.replace(/\.(md|mdx)$/,'')}/</link><guid>${site}/zh/blog/${p.id.replace(/\.(md|mdx)$/,'')}/</guid><pubDate>${p.data.date.toUTCString()}</pubDate><description>${esc(p.data.summary)}</description></item>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Tess Zhao, LCSW — 心理健康文章</title><link>${site}/zh/blog/</link><description>Tess Zhao, LCSW 分享的心理健康资源。</description>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}});
}
