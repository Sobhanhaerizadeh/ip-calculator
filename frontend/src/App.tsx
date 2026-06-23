import {useState, useEffect} from 'react';

export default function App() {

  const [prefix, setPrefix] = useState(24);
  const [ip, setIp] = useState(`192.168.1.1/${prefix}`);
  const [result, setResult] = useState<{ ip: string; binary: string; prefix_binary: string; error?: string } | null>(null);

  useEffect(() =>
  {
    const ipWithoutPrefix = ip.split('/')[0];
    setIp(`${ipWithoutPrefix}/${prefix}`);
  }, [prefix]);

  const handleClick = async () =>
  {
    const response = await fetch ("http://localhost:8000/api/subnet", {
      method : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ ip })
    });
    const data = await response.json();
    setResult(data);
  }

  
const octets = [
  { bits: result?.binary?.split(".")[0] || "10101000", dec: result?.ip?.split(".")[0] || 192, type: "net" },
  { bits: result?.binary?.split(".")[1] || "10101000", dec: result?.ip?.split(".")[1] || 168, type: "net" },
  { bits: result?.binary?.split(".")[2] || "00000001", dec: result?.ip?.split(".")[2] || 1, type: "net" },
  { bits: result?.binary?.split(".")[3] || "00000000", dec: result?.ip?.split("/")[0]?.split(".")[3] || 0, type: "host" },
  { bits: result?.prefix_binary || "00011000", dec: `/${result?.ip?.split("/")[1] || prefix}` , type: "net" },
];

// 32-Bit-Streifen — nur statisches Markup, keine Berechnung
function Strip() {
  return (
    <div className="strip">
      <div className="octets">
        {octets.map((o, gi) => (
          <div className="octet" key={gi}>
            <div className="bits">
              {o.bits.split("").map((val, bi) => {
                const isCut = gi * 8 + bi === 24; // Prefix-Schnitt bei /24
                return (
                  <div
                    key={bi}
                    className={"bit " + o.type + (isCut ? " cut" : "")}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
            <div className="dec">{o.dec}</div>
          </div>
        ))}
      </div>
      <div className="legend">
        <span className="n">
          <i></i>network bits
        </span>
        <span className="h">
          <i></i>host bits
        </span>
      </div>
    </div>
  );
}

  return (
    <div>
      <p className="eyebrow">
        subnet <b>·</b> ipv4
      </p>

      <input
        className="field"
        value={ip}
        spellCheck="false"
        autoComplete="off"
        aria-label="IP address and prefix"
        onChange={(e) => setIp(e.target.value)}
      />

      <button className="btn" onClick={handleClick}>
        Berechnen →
      </button>

      <p className="hint">
        {!result
          ? "Adresse eingeben und Berechnen klicken."
          : result.error
          ? <> Error: <span style={{ color: "red", fontFamily: "var(--mono)" }}>{result.error}</span> </>
          : <> Binär: <span style={{ color: "var(--net)", fontFamily: "var(--mono)" }}>{result.binary}</span></>
        }
      </p>

      <div className="prefix">
        <span className="num">/{prefix}</span>
        <input
          type="range"
          min="0"
          max="32"
          value={prefix}
          onChange={(e) => setPrefix(Number(e.target.value))}
          aria-label="prefix length"
        />
        <span className="lab">prefix</span>
      </div>

      <Strip />

      <div className="out">
        <div className="row2">
          <div className="cell">
            <p className="k">Network</p>
            <p className="v net">
              ...
            </p>
          </div>
          <div className="cell">
            <p className="k">Broadcast</p>
            <p className="v host">...</p>
          </div>
        </div>

        <div className="cell">
          <p className="k">Usable hosts</p>
          <p className="v">
            ... <span className="dim">&rarr;</span> ...
          </p>
        </div>

        <div className="row2">
          <div className="cell">
            <p className="k">Subnet mask</p>
            <p className="v">...</p>
          </div>
          <div className="cell">
            <p className="k">Wildcard</p>
            <p className="v">...</p>
          </div>
        </div>

        <div className="row2">
          <div className="cell">
            <p className="k">Hosts</p>
            <p className="v">...</p>
          </div>
          <div className="cell">
            <p className="k">Total addresses</p>
            <p className="v">...</p>
          </div>
        </div>
      </div>
    </div>
  );
}