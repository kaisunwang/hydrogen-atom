// src/components/Controls.jsx

export default function Controls({ n, l, m, setN, setL, setM, pushPoint, startMeasuring, stopMeasuring }) {
    const lOptions = Array.from({ length: n }, (_, i) => i)
    const mOptions = Array.from({ length: 2 * l + 1 }, (_, i) => i - l)

    const labelStyle = { fontFamily: '"Computer Modern Serif", serif', fontStyle: 'italic', fontSize: '1.125rem' }

    return (
        <div className="controls">
            <label>
                <span style={labelStyle}>n</span>
                <select value={n} onChange={e => {
                    const newN = Number(e.target.value)
                    setN(newN)
                    if (l >= newN) setL(0)
                    setM(0)
                }}>
                    {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </label>

            <label>
                <span style={labelStyle}>l</span>
                <select value={l} onChange={e => {
                    const newL = Number(e.target.value)
                    setL(newL)
                    if (Math.abs(m) > newL) setM(0)
                }}>
                    {lOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </label>

            <label>
                <span style={labelStyle}>m</span>
                <select value={m} onChange={e => setM(Number(e.target.value))}>
                    {mOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
            </label>

            <button
                onClick={pushPoint}
                onMouseDown={startMeasuring}
                onMouseUp={stopMeasuring}
                onMouseLeave={stopMeasuring}
                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
                MEASURE
            </button>
        </div>
    )
}
