/* Seamless marquee strip - two identical segments loop forever.
   Pauses on hover (CSS) so it is comfortable to read. */
export default function Ticker({ variant = 'gold', thin = false, text }) {
  const seg = text + ' //  ';
  return (
    <div className={'ticker ticker-' + variant + (thin ? ' thin' : '')} aria-hidden="true">
      <div className="ticker-track">
        <span className="ticker-seg">{seg}</span>
        <span className="ticker-seg">{seg}</span>
      </div>
    </div>
  );
}
