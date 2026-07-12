import { useCallback, useEffect, useState } from 'react';
import Background from './components/Background';
import Particles from './components/Particles';
import Nav from './components/Nav';
import ScrollRail from './components/ScrollRail';
import Ticker from './components/Ticker';
import Hero from './components/Hero';
import Story from './components/Story';
import Collection from './components/Collection';
import CustomOrders from './components/CustomOrders';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Modal from './components/Modal';
import { homeCards, officeCards, MODAL_PRESETS, cardToModal } from './data/products';
import { useMotion } from './useMotion';

export default function App() {
  const [modalData, setModalData] = useState(null);
  const [toast, setToast] = useState(null);

  useMotion();

  const openPreset = useCallback((name) => setModalData(MODAL_PRESETS[name]), []);
  const openCard = useCallback((card) => setModalData(cardToModal(card)), []);
  const closeModal = useCallback(() => setModalData(null), []);

  const showToast = useCallback((msg) => setToast(msg), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <Background />
      <Particles />
      <ScrollRail />
      <Nav />

      <main id="top">
        <Hero openModal={openPreset} />

        <Ticker variant="ink" text="B2G // B2B // D2C // CRAFTED BY OUR PROFESSIONAL CRAFTSMEN // SOLID OAK" />

        <Story />

        <Collection
          id="home-collection"
          alt
          chip="01 - THE HOME COLLECTION"
          chipTone="chip-coral"
          titleA="Rooms That"
          titleB="Remember You."
          lead={
            <>
              Every silhouette begins as a story -{' '}
              <span className="gx strong">crafted by our professional craftsmen</span> from
              responsibly sourced solid oak, finished by hand, and delivered ready to become
              part of yours.
            </>
          }
          cards={homeCards}
          onSelect={openCard}
          decor={
            <>
              <div className="aura aura-gold" data-speed="0.3" aria-hidden="true" />
              <div className="float-sq sq-gold sm" data-speed="0.8" aria-hidden="true" />
            </>
          }
        />

        <Collection
          id="office-collection"
          chip="02 - THE OFFICE COLLECTION"
          chipTone="chip-gold"
          titleA="Where Work"
          titleB="Feels Worthy."
          lead={
            <>
              From single studios to hundred-seat headquarters and government institutions -{' '}
              <span className="gx strong">crafted by our professional craftsmen</span> and
              engineered for decades of Monday mornings. B2G, B2B and D2C, served alike.
            </>
          }
          cards={officeCards}
          onSelect={openCard}
          decor={
            <>
              <div className="aura aura-coral" data-speed="0.35" aria-hidden="true" />
              <div className="float-sq sq-cream sm" data-speed="0.65" aria-hidden="true" />
            </>
          }
        />

        <CustomOrders openModal={openPreset} />
        <Contact openModal={openPreset} />
        <Footer />
      </main>

      <Modal data={modalData} onClose={closeModal} onToast={showToast} />

      <div className={'toast' + (toast ? ' show' : '')} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
