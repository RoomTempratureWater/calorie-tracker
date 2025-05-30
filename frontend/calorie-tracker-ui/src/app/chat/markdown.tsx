

"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-2 leading-relaxed" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        code: ({ node, inline, children, ...props }) =>
          inline ? (
            <code className="bg-gray-200 px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          ) : (
            <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto" {...props}>
              <code>{children}</code>
            </pre>
          ),
        ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-4" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer
