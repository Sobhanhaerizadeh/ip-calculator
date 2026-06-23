import {useState, useEffect} from 'react';

// Beispiel-Bits fuer 192.168.1.0, Prefix /24 (erste 24 Bit = network)
const octets = [
  { bits: "11000000", dec: 192, type: "net" },
  { bits: "10101000", dec: 168, type: "net" },
  { bits: "00000001", dec: 1, type: "net" },
  { bits: "00000000", dec: 0, type: "host" },
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

export default function App() {

  const [prefix, setPrefix] = useState(24);
  const [ip, setIp] = useState(`192.168.1.1/${prefix}`);
  const [result, setResult] = useState<{ ip: string; binary: string; error?: string } | null>(null);

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
              192.168.1.0<span className="dim">/{prefix}</span>
            </p>
          </div>
          <div className="cell">
            <p className="k">Broadcast</p>
            <p className="v host">192.168.1.255</p>
          </div>
        </div>

        <div className="cell">
          <p className="k">Usable hosts</p>
          <p className="v">
            192.168.1.1 <span className="dim">&rarr;</span> 192.168.1.254
          </p>
        </div>

        <div className="row2">
          <div className="cell">
            <p className="k">Subnet mask</p>
            <p className="v">255.255.255.0</p>
          </div>
          <div className="cell">
            <p className="k">Wildcard</p>
            <p className="v">0.0.0.255</p>
          </div>
        </div>

        <div className="row2">
          <div className="cell">
            <p className="k">Hosts</p>
            <p className="v">254</p>
          </div>
          <div className="cell">
            <p className="k">Total addresses</p>
            <p className="v">256</p>
          </div>
        </div>
      </div>
    </div>
  );
}