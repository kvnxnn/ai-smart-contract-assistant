"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor (client-side only)
const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false
});

export default function Home() {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "explain" | "analyze" | "optimize" | "test"
  >("analyze");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const tabPrompts: Record<typeof activeTab, string> = {
      explain:
        "You are a Solidity expert. Explain the smart contract code below in simple terms for beginners.",
      analyze:
        "You are a smart contract auditor. Identify vulnerabilities in the Solidity code below and suggest fixes.",
      optimize:
        "You are a gas optimization expert. Suggest improvements to make the Solidity code below more efficient.",
      test: "You are a Solidity tester. Generate Hardhat-compatible unit tests for the smart contract code below."
    };

    const fullPrompt = `${tabPrompts[activeTab]}\n\nUser Description: ${description}\n\nSolidity Code:\n\`\`\`solidity\n${code}\n\`\`\``;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullPrompt, description: "" }) // We're packing everything into `code`
      });

      const data = await res.json();
      setResult(data.analysis || data.message);
    } catch (err) {
      console.error("Error:", err);
      setResult("An unexpected error occurred.");
    }

    setLoading(false);
  };


  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">
          🧠 AI-Powered Smart Contract Assistant
        </h1>

        <div className="flex space-x-4 border-b border-gray-700 pb-2">
          {["explain", "analyze", "optimize", "test"].map(tab => (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab as "explain" | "analyze" | "optimize" | "test")
              }
              className={`px-3 py-1 rounded-t font-semibold capitalize ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold capitalize">
          {activeTab === "explain" && "📖 Explain Smart Contract"}
          {activeTab === "analyze" && "🔒 Analyze for Vulnerabilities"}
          {activeTab === "optimize" && "⚡ Gas Optimization"}
          {activeTab === "test" && "🧪 Generate Tests"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              🗣 Describe the problem or what you want reviewed:
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              placeholder="e.g. Check for reentrancy or gas inefficiency"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              📝 Paste your Solidity code here:
            </label>
            <CodeEditor code={code} setCode={setCode} />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              "Analyze Code"
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
            <h2 className="text-xl font-bold mb-2">🧾 Analysis Result</h2>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

    
    </main>
  );
}
