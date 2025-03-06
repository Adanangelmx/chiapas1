export interface Testimonial {
  id: number;
  name: string;
  photo: string;
  rating: number;
  comment: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    photo: "/images/Mujer chiapaneca.JPG",
    rating: 5,
    comment: "\"San Cristóbal de las Casas me robó el corazón. La mezcla de culturas, los cafés con granos recién tostados y la amabilidad de la gente hacen que quiera volver cada año. Las visitas a las comunidades indígenas fueron una experiencia única.\""
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    photo: "/images/Cañon del sumidero.jpg",
    rating: 4.5,
    comment: "\"El recorrido por el Cañón del Sumidero fue impresionante. Las paredes de roca que se elevan hacia el cielo crean un espectáculo natural único. Complementamos el viaje con visitas a las cascadas y la gastronomía local. ¡Inolvidable!\""
  },
  {
    id: 3,
    name: "Ana Ramírez",
    photo: "/images/Palenque.jpg",
    rating: 5,
    comment: "\"La zona arqueológica de Palenque superó todas mis expectativas. Caminar entre templos milenarios rodeados de selva es mágico. El guía local nos explicó cada detalle y pudimos entender mejor la grandeza de la civilización maya.\""
  }
];
