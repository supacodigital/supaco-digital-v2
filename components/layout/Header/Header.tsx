"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/SupacoMark";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { mainNav, services } from "@/lib/site";
import { MenuIcon, CloseIcon, ChevronDownIcon } from "./icons";
import styles from "./Header.module.css";

const MEGA_MENU_ID = "mega-menu-services";
const CLOSE_DELAY = 140; // ms — zone de grâce entre le lien et le panneau

/** Le lien de nav est-il la page courante (ou une de ses sous-pages) ? */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // ignore les ancres (/#portfolio) pour l'état actif
  const path = href.split("#")[0];
  if (!path || path === "/") return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * En-tête collant en verre dépoli.
 * - se densifie (blur + fond plus opaque) après un léger scroll
 * - le CTA parallélogramme se compacte au scroll
 * - « Services » déploie un mega-menu pleine largeur au survol (desktop),
 *   avec délai de grâce à la fermeture + fermeture au clavier (Échap / focus out)
 * - menu plein écran sur mobile
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [servicesExpandedMobile, setServicesExpandedMobile] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<number | null>(null);
  const megaGroupRef = useRef<HTMLLIElement | null>(null);

  // ferme tous les panneaux quand la route change — pattern React « ajuster
  // l'état pendant le rendu quand une prop change » (pas d'effet)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
    setServicesExpandedMobile(false);
  }

  // état "scrolled" : le header passe de transparent à bleu nuit opaque.
  // seuil ~24px pour ne pas basculer au moindre frémissement ; transition CSS.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // verrouille le scroll du body quand le menu mobile est ouvert + Échap = fermer
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Échap ferme le mega-menu
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaOpen]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const openMega = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), CLOSE_DELAY);
  };

  // ferme le mega-menu quand le focus clavier quitte entièrement sa zone
  const handleMegaBlur = (e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    const group = megaGroupRef.current;
    const panel = document.getElementById(MEGA_MENU_ID);
    if (next && (group?.contains(next) || panel?.contains(next))) return;
    setMegaOpen(false);
  };

  // Tab depuis le lien « Services » (menu ouvert) → entre dans le panneau
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || e.shiftKey || !megaOpen) return;
    const panel = document.getElementById(MEGA_MENU_ID);
    const first = panel?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    if (first) {
      e.preventDefault();
      first.focus();
    }
  };

  // navigation clavier À L'INTÉRIEUR du panneau : Tab sortant → item de nav
  // suivant « Services » ; Shift+Tab depuis le 1er élément → retour au lien
  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const panel = document.getElementById(MEGA_MENU_ID);
    if (!panel) return;
    const focusables = [
      ...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const trigger = megaGroupRef.current?.querySelector<HTMLElement>("a");

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      trigger?.focus();
      setMegaOpen(false);
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      // lien de nav suivant après le groupe « Services »
      const nextNavLink =
        megaGroupRef.current?.nextElementSibling?.querySelector<HTMLElement>(
          "a",
        );
      setMegaOpen(false);
      nextNavLink?.focus();
    }
  };

  return (
    <header
      className={styles.header}
      data-scrolled={scrolled || undefined}
      data-open={menuOpen || undefined}
      data-mega={megaOpen || undefined}
    >
      <Container as="div" className={styles.bar}>
        <Logo priority />

        {/* desktop : nav + CTA groupés à droite */}
        <div className={styles.right}>
          <nav
            className={styles.nav}
            aria-label="Navigation principale"
            onBlur={handleMegaBlur}
          >
            <ul className={styles.navList}>
              {mainNav.map((item) =>
                item.megaMenu === "services" ? (
                  <li
                    key={item.href}
                    ref={megaGroupRef}
                    className={styles.navItemMega}
                    onMouseEnter={openMega}
                    onMouseLeave={scheduleCloseMega}
                  >
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                      aria-expanded={megaOpen}
                      aria-controls={MEGA_MENU_ID}
                      onFocus={openMega}
                      onKeyDown={handleTriggerKeyDown}
                    >
                      {item.label}
                      <ChevronDownIcon size={11} className={styles.caret} />
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      aria-current={
                        isActive(pathname, item.href) ? "page" : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className={styles.actions}>
            {/* CTA desktop : se compacte au scroll */}
            <Button
              href="/contact"
              size={scrolled ? "sm" : "md"}
              className={styles.ctaDesktop}
            >
              Devis
            </Button>

            {/* CTA compact mobile */}
            <Button
              href="/contact"
              size="sm"
              className={styles.ctaMobile}
              aria-label="Demander un devis"
            >
              Devis
            </Button>

            <button
              type="button"
              className={styles.menuToggle}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mega-menu desktop — plein largeur, sous la barre */}
      <div
        className={styles.megaWrap}
        onMouseEnter={openMega}
        onMouseLeave={scheduleCloseMega}
        onBlur={handleMegaBlur}
        onKeyDown={handlePanelKeyDown}
        hidden={!megaOpen}
      >
        <MegaMenu id={MEGA_MENU_ID} />
        {/* voile : assombrit la page derrière le mega-menu, clic = fermer */}
        <button
          type="button"
          className={styles.megaScrim}
          aria-label="Fermer le menu Services"
          tabIndex={-1}
          onClick={() => setMegaOpen(false)}
        />
      </div>

      {/* Menu mobile plein écran */}
      <nav
        id="mobile-menu"
        className={styles.mobileMenu}
        aria-label="Navigation mobile"
        hidden={!menuOpen}
      >
        <Container as="div" className={styles.mobileInner}>
          <ul className={styles.mobileList}>
            {mainNav.map((item, i) =>
              item.megaMenu === "services" ? (
                <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                  <button
                    type="button"
                    className={styles.mobileLinkToggle}
                    aria-expanded={servicesExpandedMobile}
                    onClick={() => setServicesExpandedMobile((v) => !v)}
                  >
                    {item.label}
                    <ChevronDownIcon
                      size={16}
                      className={styles.mobileCaret}
                    />
                  </button>
                  <ul
                    className={styles.mobileSubList}
                    hidden={!servicesExpandedMobile}
                  >
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className={styles.mobileSubLink}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/services" className={styles.mobileSubLink}>
                        Tous les services
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    className={styles.mobileLink}
                    aria-current={
                      isActive(pathname, item.href) ? "page" : undefined
                    }
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Button href="/contact" size="lg" fullWidth>
            Demander un devis
          </Button>
        </Container>
      </nav>
    </header>
  );
}
