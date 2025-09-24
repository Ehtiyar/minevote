import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('servers')

  const endpoints = [
    {
      id: 'servers',
      name: 'Sunucular',
      description: 'Sunucu listesi ve detayları',
      methods: [
        {
          method: 'GET',
          path: '/api/servers',
          description: 'Tüm sunucuları listele',
          parameters: [
            { name: 'page', type: 'number', required: false, description: 'Sayfa numarası (varsayılan: 1)' },
            { name: 'limit', type: 'number', required: false, description: 'Sayfa başına öğe sayısı (varsayılan: 20)' },
            { name: 'sort', type: 'string', required: false, description: 'Sıralama (votes, created_at, name)' },
            { name: 'status', type: 'string', required: false, description: 'Sunucu durumu (online, offline)' }
          ],
          example: {
            request: 'GET /api/servers?page=1&limit=10&sort=votes',
            response: {
              servers: [
                {
                  id: 'uuid',
                  name: 'Sunucu Adı',
                  description: 'Sunucu açıklaması',
                  ip: 'play.example.com',
                  port: 25565,
                  total_votes: 1250,
                  current_players: 45,
                  max_players: 100,
                  status: 'online',
                  banner_url: 'https://example.com/banner.png',
                  created_at: '2024-01-01T00:00:00Z'
                }
              ],
              pagination: {
                page: 1,
                limit: 10,
                total: 150,
                pages: 15
              }
            }
          }
        },
        {
          method: 'GET',
          path: '/api/servers/{id}',
          description: 'Belirli bir sunucunun detaylarını getir',
          parameters: [
            { name: 'id', type: 'string', required: true, description: 'Sunucu UUID\'si' }
          ],
          example: {
            request: 'GET /api/servers/123e4567-e89b-12d3-a456-426614174000',
            response: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Sunucu Adı',
              description: 'Detaylı sunucu açıklaması',
              ip: 'play.example.com',
              port: 25565,
              total_votes: 1250,
              current_players: 45,
              max_players: 100,
              status: 'online',
              banner_url: 'https://example.com/banner.png',
              website: 'https://example.com',
              discord: 'https://discord.gg/example',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-15T12:30:00Z'
            }
          }
        }
      ]
    },
    {
      id: 'votes',
      name: 'Oylar',
      description: 'Oylama işlemleri',
      methods: [
        {
          method: 'POST',
          path: '/api/vote/submit',
          description: 'Sunucuya oy ver',
          parameters: [
            { name: 'server_id', type: 'string', required: true, description: 'Sunucu UUID\'si' },
            { name: 'username', type: 'string', required: true, description: 'Oyuncu kullanıcı adı' },
            { name: 'recaptcha_token', type: 'string', required: true, description: 'reCAPTCHA token' }
          ],
          example: {
            request: 'POST /api/vote/submit',
            body: {
              server_id: '123e4567-e89b-12d3-a456-426614174000',
              username: 'OyuncuAdi',
              recaptcha_token: 'recaptcha_token_here'
            },
            response: {
              success: true,
              message: 'Oyunuz başarıyla kaydedildi',
              vote_id: 'vote_uuid',
              next_vote_time: '2024-01-16T12:30:00Z'
            }
          }
        },
        {
          method: 'GET',
          path: '/api/votes/user/{username}',
          description: 'Kullanıcının oy geçmişi',
          parameters: [
            { name: 'username', type: 'string', required: true, description: 'Oyuncu kullanıcı adı' }
          ],
          example: {
            request: 'GET /api/votes/user/OyuncuAdi',
            response: {
              username: 'OyuncuAdi',
              total_votes: 25,
              votes: [
                {
                  id: 'vote_uuid',
                  server_id: 'server_uuid',
                  server_name: 'Sunucu Adı',
                  created_at: '2024-01-15T12:30:00Z'
                }
              ]
            }
          }
        }
      ]
    },
    {
      id: 'stats',
      name: 'İstatistikler',
      description: 'Platform istatistikleri',
      methods: [
        {
          method: 'GET',
          path: '/api/stats',
          description: 'Genel platform istatistikleri',
          parameters: [],
          example: {
            request: 'GET /api/stats',
            response: {
              totalServers: 150,
              totalPlayers: 2500,
              totalVotes: 15000,
              onlineServers: 120
            }
          }
        }
      ]
    }
  ]

  const selectedEndpointData = endpoints.find(ep => ep.id === selectedEndpoint)

  return (
    <>
      <Head>
        <title>API Dokümantasyonu - MineVote</title>
        <meta name="description" content="MineVote API dokümantasyonu. Sunucu listesi, oylama, istatistikler ve daha fazlası için API endpoint'leri." />
        <meta name="keywords" content="minevote, api, dokümantasyon, minecraft, sunucu, oylama, rest api" />
      </Head>

      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-2 text-emerald-400 text-xl font-bold">
                <span className="w-8 h-8 flex items-center justify-center">🟩</span>
                <span>MineVote</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-300 hover:text-white">
                  Ana Sayfa
                </Link>
                <Link href="/servers" className="text-gray-300 hover:text-white">
                  Sunucular
                </Link>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  Yardım
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">📚 API Dokümantasyonu</h1>
            <p className="text-gray-400 text-lg">
              MineVote API'sini kullanarak sunucu verilerine erişin ve oylama işlemlerini gerçekleştirin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-white mb-4">Endpoint'ler</h2>
                <nav className="space-y-2">
                  {endpoints.map(endpoint => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedEndpoint === endpoint.id
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {endpoint.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedEndpointData && (
                <div className="space-y-8">
                  <div className="bg-gray-800 rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      {selectedEndpointData.name}
                    </h2>
                    <p className="text-gray-400 mb-6">
                      {selectedEndpointData.description}
                    </p>

                    {selectedEndpointData.methods.map((method, index) => (
                      <div key={index} className="mb-8 last:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`px-3 py-1 rounded text-sm font-medium ${
                            method.method === 'GET' ? 'bg-green-600 text-white' :
                            method.method === 'POST' ? 'bg-blue-600 text-white' :
                            method.method === 'PUT' ? 'bg-yellow-600 text-white' :
                            method.method === 'DELETE' ? 'bg-red-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {method.method}
                          </span>
                          <code className="text-emerald-400 font-mono">
                            {method.path}
                          </code>
                        </div>

                        <p className="text-gray-300 mb-4">
                          {method.description}
                        </p>

                        {method.parameters && method.parameters.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium text-white mb-3">Parametreler</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-700">
                                    <th className="text-left py-2 text-gray-300">Parametre</th>
                                    <th className="text-left py-2 text-gray-300">Tip</th>
                                    <th className="text-left py-2 text-gray-300">Zorunlu</th>
                                    <th className="text-left py-2 text-gray-300">Açıklama</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {method.parameters.map((param, paramIndex) => (
                                    <tr key={paramIndex} className="border-b border-gray-800">
                                      <td className="py-2 text-emerald-400 font-mono">{param.name}</td>
                                      <td className="py-2 text-gray-300">{param.type}</td>
                                      <td className="py-2 text-gray-300">
                                        {param.required ? '✅' : '❌'}
                                      </td>
                                      <td className="py-2 text-gray-300">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {method.example && (
                          <div className="mb-6">
                            <h4 className="text-lg font-medium text-white mb-3">Örnek</h4>
                            
                            <div className="mb-4">
                              <h5 className="text-sm font-medium text-gray-300 mb-2">İstek:</h5>
                              <div className="bg-gray-900 rounded-lg p-4">
                                <code className="text-emerald-400 font-mono text-sm">
                                  {method.example.request}
                                </code>
                              </div>
                            </div>

                            {(method.example as any).body && (
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-300 mb-2">Body:</h5>
                                <div className="bg-gray-900 rounded-lg p-4">
                                  <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                                    {JSON.stringify((method.example as any).body, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}

                            <div>
                              <h5 className="text-sm font-medium text-gray-300 mb-2">Yanıt:</h5>
                              <div className="bg-gray-900 rounded-lg p-4">
                                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                                  {JSON.stringify(method.example.response, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* API Info */}
          <div className="mt-12 bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">API Bilgileri</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">🔑 Kimlik Doğrulama</h3>
                <p className="text-gray-400 mb-4">
                  Çoğu endpoint için kimlik doğrulama gerekmez. Ancak rate limiting uygulanır.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• IP başına dakikada 60 istek</li>
                  <li>• Oylama için günde 1 oy</li>
                  <li>• API key ile limitler artırılabilir</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">📊 Rate Limiting</h3>
                <p className="text-gray-400 mb-4">
                  API kullanımınızı optimize etmek için rate limiting uygulanır.
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li>• Ücretsiz: 1000 istek/gün</li>
                  <li>• Premium: 10000 istek/gün</li>
                  <li>• Enterprise: Sınırsız</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/contact"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                API Key Al
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
