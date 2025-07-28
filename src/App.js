// App.jsx
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ReactDom from 'react-dom/client'
import './index.css?url' // Updated import

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");
  const [files, setFiles] = useState({});

  const handleGen = async () => {
    setIsLoading(true);
    setError("");
    setPreviewUrl("");

    try {
      // Call your backend for generated code structure
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: prompt })
      });

      if (!res.ok) throw new Error("Failed to fetch code from backend");
      const data = await res.json();
      setFiles(data.files);

      // Send to CodeSandbox Define API
      const defineRes = await fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ files: data.files })
      });

      if (!defineRes.ok) throw new Error("Failed to create sandbox");
      const sandboxData = await defineRes.json();
      setPreviewUrl(`https://codesandbox.io/embed/${sandboxData.sandbox_id}?view=preview&theme=${theme}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([filename, fileObj]) => {
      zip.file(filename, fileObj.content);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "generated-code.zip");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (previewUrl.includes("codesandbox.io/embed")) {
      setPreviewUrl(prev => prev.replace(/theme=\w+/, `theme=${newTheme}`));
    }
  };

  return (

        <div id="webcrumbs">
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-4 md:p-8 lg:p-10 transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-400 dark:to-blue-500 inline-block">
                               WebArtist
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                                Generate, preview and download code with ease
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-200 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                            >
                                <span className="material-symbols-outlined mr-2">
                                    {theme === "dark" ? "light_mode" : "dark_mode"}
                                </span>
                                {theme === "dark" ? "Light Mode" : "Dark Mode"}
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                <label
                                    htmlFor="prompt"
                                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                                >
                                    Your Prompt
                                </label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Describe the code you want to generate..."
                                    className="w-full h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                                ></textarea>
                                <button
                                    onClick={handleGen}
                                    className="mt-4 w-full flex items-center justify-center px-5 py-3 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-70"
                                    disabled={isLoading}
                                >
                                    <span className="material-symbols-outlined mr-2">code</span>
                                    {isLoading ? "Generating..." : "Generate Code"}
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex-1 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">settings</span>
                                    Actions
                                </h2>
                                <div className="flex flex-col space-y-4">
                                    <button
                                        onClick={handleDownload}
                                        className="flex items-center justify-center px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-70"
                                        disabled={!Object.keys(files).length}
                                    >
                                        <span className="material-symbols-outlined mr-2">download</span>
                                        Download ZIP
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex-1 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">info</span>
                                    Status
                                </h2>
                                {isLoading && (
                                    <div className="flex items-center text-primary-600 dark:text-primary-400">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        <div>
                                            <p className="font-medium">Processing your request...</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                This may take a few moments
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg flex items-start">
                                        <span className="material-symbols-outlined mr-2 mt-0.5">error</span>
                                        <div>
                                            <p className="font-medium">Error encountered</p>
                                            <p className="text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}
                                {!isLoading && !error && (
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <span className="material-symbols-outlined mr-2 text-green-500">
                                                check_circle
                                            </span>
                                            <div>
                                                <p className="font-medium">
                                                    {Object.keys(files).length ? "Files ready" : "Ready to generate"}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {Object.keys(files).length
                                                        ? `${Object.keys(files).length} files available for download`
                                                        : "Enter a prompt to get started"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex-1 transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                                <h2 className="text-lg font-semibold mb-4 flex items-center">
                                    <span className="material-symbols-outlined mr-2">tips_and_updates</span>
                                    Tips
                                </h2>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex items-start">
                                        <span className="material-symbols-outlined text-primary-500 mr-2 text-base">
                                            arrow_right
                                        </span>
                                        Be specific about frameworks and styling
                                    </li>
                                    <li className="flex items-start">
                                        <span className="material-symbols-outlined text-primary-500 mr-2 text-base">
                                            arrow_right
                                        </span>
                                        Mention any dependencies required
                                    </li>
                                    <li className="flex items-start">
                                        <span className="material-symbols-outlined text-primary-500 mr-2 text-base">
                                            arrow_right
                                        </span>
                                        Describe the desired functionality clearly
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {previewUrl && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl mb-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <span className="material-symbols-outlined mr-2">preview</span>
                                Live Preview
                            </h2>
                            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex space-x-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono px-2 py-1 rounded bg-gray-200 dark:bg-gray-600">
                                        preview
                                    </div>
                                </div>
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-[500px] md:h-[600px] lg:h-[700px] transition-all duration-300"
                                    title="Code Preview"
                                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                    sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                © 2023 Code Preview Generator - Create, preview and share code with ease
                            </p>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-primary-500 transition-colors duration-300"
                                >
                                    <i className="fa-brands fa-github text-xl"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-primary-500 transition-colors duration-300"
                                >
                                    <i className="fa-brands fa-twitter text-xl"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-primary-500 transition-colors duration-300"
                                >
                                    <i className="fa-brands fa-discord text-xl"></i>
                                </a>
                            </div>
                            {/* Next: "Add a newsletter subscription form" */}
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}


ReactDom.createRoot(document.getElementById(`root`)).render(<App></App>);