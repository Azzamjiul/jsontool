import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState('validator') // 'validator' or 'stringify'
  const [jsonInput, setJsonInput] = useState('')
  const [formattedJson, setFormattedJson] = useState('')
  const [error, setError] = useState('')
  const [url, setUrl] = useState('')

  const validateAndFormat = () => {
    try {
      if (!jsonInput.trim()) {
        setError('Please enter some JSON')
        return
      }
      const parsedJson = JSON.parse(jsonInput)
      setFormattedJson(JSON.stringify(parsedJson, null, 2))
      setError('')
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`)
      setFormattedJson('')
    }
  }

  const handleUrlSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(url)
      const data = await response.json()
      setJsonInput(JSON.stringify(data))
      validateAndFormat()
    } catch (err) {
      setError(`Error fetching JSON from URL: ${err.message}`)
    }
  }

  const stringifyObject = () => {
    try {
      // eslint-disable-next-line no-eval
      const obj = eval('(' + jsonInput + ')')
      setFormattedJson(JSON.stringify(obj, null, 2))
      setError('')
    } catch (err) {
      setError(`Invalid JS object: ${err.message}`)
      setFormattedJson('')
    }
  }

  const clearAll = () => {
    setJsonInput('')
    setFormattedJson('')
    setError('')
    setUrl('')
  }

  return (
    // Apply a subtle gradient background
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Refine container shadow and add border */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Add padding within the container */}
        <div className="p-6 sm:p-8">
          {/* Adjust title styling */}
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-900">JSON Tool</h1>

          {/* Refine Tabs */}
          <div className="flex justify-center border-b border-gray-200 mb-8">
            <button
              className={`px-5 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors duration-200 ease-in-out ${
                mode === 'validator'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => { setMode('validator'); clearAll(); }}
            >
              Validate & Format
            </button>
            <button
              className={`px-5 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors duration-200 ease-in-out ${
                mode === 'stringify'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => { setMode('stringify'); clearAll(); }}
            >
              Stringify JS Object
            </button>
          </div>

          {/* URL input section */}
          {mode === 'validator' && (
            <div className="mb-6">
              <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor="urlInput" className="sr-only">Enter JSON URL</label>
                <input
                  id="urlInput"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Or load JSON from URL..."
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Load URL
                </button>
              </form>
            </div>
          )}

          {/* Main input/output grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Area */}
            <div>
              <label htmlFor="jsonInputArea" className="block text-lg font-semibold mb-2 text-gray-700">
                {mode === 'validator' ? 'Input JSON' : 'Input JS Object'}
              </label>
              <textarea
                id="jsonInputArea"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder={mode === 'validator' ? 'Paste your JSON here or load from URL...' : 'Paste your JS object here (e.g., { key: "value" })...'}
                className="w-full h-80 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out resize-y shadow-sm"
                spellCheck="false"
              />
              <button
                onClick={mode === 'validator' ? validateAndFormat : stringifyObject}
                className="mt-4 w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                {mode === 'validator' ? 'Validate & Format' : 'Stringify Object'}
              </button>
            </div>

            {/* Output Area */}
            <div>
              <label htmlFor="formattedOutput" className="block text-lg font-semibold mb-2 text-gray-700">
                {mode === 'validator' ? 'Formatted JSON' : 'JSON String Output'}
              </label>
              <div className="relative w-full h-80 border border-gray-300 rounded-lg bg-gray-50 overflow-hidden shadow-sm">
                 <pre
                   id="formattedOutput"
                   className="absolute inset-0 p-4 font-mono text-sm text-gray-800 overflow-auto whitespace-pre-wrap break-words"
                 >
                   {formattedJson || (
                     <span className="text-gray-400">
                       {mode === 'validator' ? 'Formatted JSON will appear here...' : 'JSON string output will appear here...'}
                     </span>
                   )}
                 </pre>
              </div>
               {formattedJson && (
                 <button
                   onClick={() => navigator.clipboard.writeText(formattedJson)}
                   className="mt-4 w-full py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
                 >
                   Copy Output
                 </button>
               )}
            </div>
          </div>

          {/* Refined Error Message */}
          {error && (
            <div className="mt-6 text-red-700 bg-red-100 border border-red-300 rounded-lg p-4 text-center font-medium text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Clear Button - maybe slightly less prominent */}
          <div className="mt-8 text-center">
            <button
              className="py-2 px-6 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
