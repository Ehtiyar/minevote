import { GetServerSideProps } from 'next'
import { getSupabaseAdmin } from '../lib/supabaseServer'

function generateSiteMap(servers: Array<{id: string, updated_at?: string, created_at?: string}>) {
  const baseUrl = 'https://minevote.netlify.app'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/servers</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${baseUrl}/auth/login</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${baseUrl}/auth/register</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     ${servers
       .map((server) => {
         const lastMod = server.updated_at || server.created_at || new Date().toISOString()
         return `
       <url>
           <loc>${baseUrl}/servers/${server.id}</loc>
           <lastmod>${new Date(lastMod).toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const supabase = getSupabaseAdmin()
    const { data: servers } = await supabase
      .from('servers')
      .select('id, updated_at, created_at')
      .eq('status', 'online')
      .limit(1000)

    const sitemap = generateSiteMap(servers || [])

    res.setHeader('Content-Type', 'text/xml')
    res.write(sitemap)
    res.end()

    return {
      props: {},
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
    res.statusCode = 500
    res.end()
    return {
      props: {},
    }
  }
}

export default SiteMap
