import Ticker from './Ticker';

export default function Footer() {
  return (
    <footer className="footer">
      <Ticker variant="gold" thin text="ARTHAOAK // TIMELESS WOODWORK // MODERN MINIMALISM // EST. 2026" />
      <div className="footer-inner">
        <p className="footer-name">Arthaoak Living Solutions Private&nbsp;Limited</p>
        <p className="footer-line">&copy; 2026 Arthaoak Living Solutions Pvt. Ltd. &middot; All rights reserved.</p>
        <p className="footer-line">B2G &middot; B2B &middot; D2C</p>
      </div>
    </footer>
  );
}
