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
  return (
    <div>
      <p className="eyebrow">
        subnet <b>·</b> ipv4
      </p>

      <input
        className="field"
        defaultValue="192.168.1.0/24"
        readOnly
        spellCheck="false"
        autoComplete="off"
        aria-label="IP address and prefix"
      />
      <p className="hint">
        Adresse mit Schrägstrich eingeben, oder den Prefix ziehen.
      </p>

      <div className="prefix">
        <span className="num">/24</span>
        <input
          type="range"
          min="0"
          max="32"
          defaultValue={24}
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
              192.168.1.0<span className="dim">/24</span>
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