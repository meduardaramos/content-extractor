import React, { useState, useRef } from 'react'

function App() {
  const [file, setFile] = useState(null)
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile)
        setError(null)
      } else {
        setError('Por favor, selecione apenas arquivos PDF')
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Por favor, selecione apenas arquivos PDF')
      }
    }
  }

  const processarPDF = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo PDF')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/processar-pdf', {
      const response = await fetch('/api/processar-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao processar PDF')
      }

      const result = await response.json()
      setDados(result.dados || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const atualizarDado = (index, campo, valor) => {
    const novosDados = [...dados]
    novosDados[index][campo] = valor
    setDados(novosDados)
  }

  const exportarCSV = () => {
    if (dados.length === 0) return

    const headers = ['Tipologia', 'Código', 'Descrição', 'Pavimento', 'Quantidade']
    const csvContent = [
      headers.join(','),
      ...dados.map(row => [
        `"${row.tipologia || ''}"`,
        `"${row.codigo || ''}"`,
        `"${row.descricao || ''}"`,
        `"${row.pavimento || ''}"`,
        row.quantidade || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'sinalizacao.csv'
    link.click()
  }

  const exportarExcel = async () => {
    if (dados.length === 0) return

    try {
      const response = await fetch('/api/gerar-excel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dados }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar Excel')
      }

      const blob = await response.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'sinalizacao.xlsx'
      link.click()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-bold text-center text-white mb-8 drop-shadow-lg">
          📋 Extrator de Manual de Sinalização
        </h1>

        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6">
          <div
            className={`border-3 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-indigo-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {file ? (
              <p className="text-lg text-green-600 font-semibold mb-2">
                ✓ {file.name}
              </p>
            ) : (
              <p className="text-lg text-gray-600 mb-2">
                Arraste e solte seu PDF aqui ou
              </p>
            )}
            
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Selecionar Arquivo
            </button>
          </div>

          <button
            onClick={processarPDF}
            disabled={!file || loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg shadow-lg"
          >
            {loading ? '⏳ Processando...' : '🚀 Processar PDF'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Tabela de Dados */}
        {dados.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📊 Dados Extraídos ({dados.length} registros)
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={exportarCSV}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow"
                >
                  📥 Exportar CSV
                </button>
                <button
                  onClick={exportarExcel}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow"
                >
                  📊 Exportar Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Tipologia</th>
                    <th className="px-4 py-3 text-left font-semibold">Código</th>
                    <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                    <th className="px-4 py-3 text-left font-semibold">Pavimento</th>
                    <th className="px-4 py-3 text-left font-semibold">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.tipologia || ''}
                          onChange={(e) => atualizarDado(index, 'tipologia', e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.codigo || ''}
                          onChange={(e) => atualizarDado(index, 'codigo', e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.descricao || ''}
                          onChange={(e) => atualizarDado(index, 'descricao', e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.pavimento || ''}
                          onChange={(e) => atualizarDado(index, 'pavimento', e.target.value)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantidade || 0}
                          onChange={(e) => atualizarDado(index, 'quantidade', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
