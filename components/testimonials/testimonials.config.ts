/*
 * One testimonial per partner, keyed by the section that shows it.
 *
 * The photograph lives in public/peoples, named after the person who gave the
 * words. The quotation marks are not here: they belong to the component that
 * sets the quote, so every testimonial gets the same typography.
 */

export type TestimonialContent = {
  author: string;
  photo: string;
  quote: string;
};

export const testimonials = {
  cigalon: {
    author: "Jean-Marc Bessire",
    photo: "/peoples/jean-marc-bessire.jpg",
    quote:
      "Une réalisation superbe. Cette vidéo reflète à merveille l’âme de notre restaurant, mettant en valeur notre cuisine, notre équipe et l’ambiance chaleureuse que nous souhaitons offrir à nos clients. Merci WaveProm.",
  },
  quimporte: {
    author: "Groupe Chuard",
    photo: "/logotypes/groupe-chuard-symbole.png",
    quote:
      "Nous sommes entièrement satisfaits. Leur efficacité et leur compréhension de nos attentes ont vraiment fait la différence. L’équipe a su capter l’essence de notre établissement avec justesse. Nous recommandons vivement leurs services.",
  },
  nicastrosa: {
    author: "Rahman Babayigit",
    photo: "/peoples/nicastrosa.png",
    quote:
      "Aujourd’hui, nous avons une image haut de gamme et une vraie visibilité qui nous apportent de la crédibilité auprès de nos clients. Au-delà des prestations techniques, ils sont devenus un véritable partenaire stratégique pour le développement de mon entreprise. Ils m’accompagnent aussi sur divers aspects commerciaux et m’ont même déjà apporté des opportunités d’affaires grâce à leur réseau.",
  },
  labinno: {
    author: "Hanane Loumassine",
    photo: "/peoples/hanane-loumassine.png",
    quote:
      "Très bon service de la part d’Issao. Il prend le temps de bien cibler les besoins et adapte son service de manière professionnelle et efficace. Je recommande grandement WaveProm !",
  },
  agis: {
    author: "Myriam Lombardi",
    photo: "/peoples/myriam-lombardi.jpg",
    quote:
      "Avant notre collaboration avec WaveProm, nos campagnes publicitaires n’attiraient qu’une trentaine de personnes par mois. Depuis que leur équipe gère nos campagnes, nous avons reçu plus d’une centaine de demandes en moins d’un mois.",
  },
} satisfies Record<string, TestimonialContent>;
