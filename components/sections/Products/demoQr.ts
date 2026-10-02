/**
 * QR code de démonstration du badge (section Produits) — vrai code scannable,
 * il ouvre https://supaco-digital.com. Matrice QR version 2 (25×25 modules,
 * correction M), sans zone de silence : le SVG l'ajoute autour.
 *
 * Généré hors build (pas de librairie QR chargée côté client) avec segno :
 *   python3 -c "import segno; q = segno.make('<url>', error='m', micro=False)"
 * puis chaque suite de modules noirs d'une ligne devient « M x y h… v1 h-… z ».
 * Pour viser une autre URL (ex. la fiche Google de Supaco), regénérer ce chemin.
 */
export const demoQr = {
  url: "https://supaco-digital.com",
  size: 25,
  path: "M0 0h7v1h-7zM8 0h1v1h-1zM10 0h5v1h-5zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM11 1h4v1h-4zM16 1h1v1h-1zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM12 2h2v1h-2zM15 2h2v1h-2zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM10 3h2v1h-2zM13 3h3v1h-3zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h3v1h-3zM14 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h2v1h-2zM11 5h2v1h-2zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM10 7h2v1h-2zM14 7h1v1h-1zM16 7h1v1h-1zM0 8h1v1h-1zM2 8h1v1h-1zM6 8h2v1h-2zM12 8h1v1h-1zM15 8h2v1h-2zM19 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM0 9h1v1h-1zM4 9h1v1h-1zM8 9h2v1h-2zM11 9h2v1h-2zM14 9h6v1h-6zM21 9h1v1h-1zM23 9h2v1h-2zM1 10h3v1h-3zM6 10h5v1h-5zM13 10h1v1h-1zM15 10h1v1h-1zM18 10h1v1h-1zM21 10h2v1h-2zM24 10h1v1h-1zM4 11h2v1h-2zM7 11h1v1h-1zM10 11h3v1h-3zM16 11h2v1h-2zM21 11h1v1h-1zM1 12h1v1h-1zM5 12h2v1h-2zM10 12h1v1h-1zM12 12h1v1h-1zM16 12h1v1h-1zM18 12h1v1h-1zM24 12h1v1h-1zM1 13h3v1h-3zM5 13h1v1h-1zM7 13h4v1h-4zM15 13h1v1h-1zM17 13h3v1h-3zM23 13h2v1h-2zM0 14h3v1h-3zM6 14h4v1h-4zM11 14h1v1h-1zM13 14h3v1h-3zM17 14h2v1h-2zM21 14h2v1h-2zM24 14h1v1h-1zM2 15h1v1h-1zM4 15h1v1h-1zM8 15h2v1h-2zM12 15h1v1h-1zM14 15h3v1h-3zM19 15h3v1h-3zM0 16h2v1h-2zM4 16h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM12 16h1v1h-1zM16 16h5v1h-5zM23 16h1v1h-1zM8 17h2v1h-2zM11 17h3v1h-3zM16 17h1v1h-1zM20 17h1v1h-1zM24 17h1v1h-1zM0 18h7v1h-7zM8 18h4v1h-4zM13 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM24 18h1v1h-1zM0 19h1v1h-1zM6 19h1v1h-1zM11 19h2v1h-2zM15 19h2v1h-2zM20 19h1v1h-1zM24 19h1v1h-1zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM12 20h1v1h-1zM14 20h7v1h-7zM23 20h1v1h-1zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM11 21h3v1h-3zM15 21h3v1h-3zM20 21h1v1h-1zM22 21h2v1h-2zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM8 22h1v1h-1zM10 22h2v1h-2zM15 22h3v1h-3zM19 22h3v1h-3zM23 22h2v1h-2zM0 23h1v1h-1zM6 23h1v1h-1zM9 23h3v1h-3zM16 23h1v1h-1zM19 23h2v1h-2zM0 24h7v1h-7zM8 24h1v1h-1zM10 24h3v1h-3zM16 24h1v1h-1zM18 24h1v1h-1zM21 24h1v1h-1zM24 24h1v1h-1z",
} as const;
