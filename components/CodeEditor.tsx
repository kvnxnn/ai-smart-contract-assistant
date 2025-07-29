"use client";

import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import * as monaco from "monaco-editor";

export default function CodeEditor({
  code,
  setCode
}: {
  code: string;
  setCode: (val: string) => void;
}) {
  useEffect(() => {
    monaco.languages.register({ id: "solidity" });

    monaco.languages.setMonarchTokensProvider("solidity", {
      keywords: [
        "pragma",
        "contract",
        "interface",
        "library",
        "function",
        "modifier",
        "event",
        "public",
        "private",
        "internal",
        "external",
        "view",
        "pure",
        "payable",
        "returns",
        "memory",
        "storage",
        "calldata",
        "if",
        "else",
        "require",
        "revert",
        "return",
        "emit"
      ],
      typeKeywords: [
        "address",
        "bool",
        "string",
        "int",
        "uint",
        "bytes",
        "mapping"
      ],

      tokenizer: {
        root: [
          [
            /[a-z_$][\w$]*/,
            {
              cases: {
                "@keywords": "keyword",
                "@typeKeywords": "type",
                "@default": "identifier"
              }
            }
          ],
          [/[A-Z][\w\$]*/, "type.identifier"],
          { include: "@whitespace" },
          [/\d+/, "number"],
          [/".*?"/, "string"],
          [/\/\/.*$/, "comment"],
          [/\/\*/, { token: "comment", next: "@comment" }]
        ],

        comment: [
          [/[^\/*]+/, "comment"],
          [/\*\//, "comment", "@pop"],
          [/[\/*]/, "comment"]
        ],

        whitespace: [[/[ \t\r\n]+/, "white"]]
      }
    });

    monaco.editor.defineTheme("solidity-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "C586C0" },
        { token: "type", foreground: "569CD6" },
        { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        { token: "string", foreground: "CE9178" }
      ],
      colors: {}
    });
  }, []);

  return (
    <Editor
      height="350px"
      language="solidity"
      value={code}
      onChange={val => setCode(val || "")}
      theme="solidity-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false
      }}
    />
  );
}
