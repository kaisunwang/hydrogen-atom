// src/components/EquationDisplay.jsx
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function EquationDisplay({ katexString }) {
    const html = katex.renderToString(katexString, { throwOnError: false })

    return (
        <div
            className="equation"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}
