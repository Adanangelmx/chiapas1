export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  tags: {
    primary: {
      label: string;
      color: string;
    };
    secondary: {
      label: string;
      color: string;
    };
  };
}

export const destinations: Destination[] = [
  {
    id: "san-cristobal",
    name: "San Cristóbal de las Casas",
    image: "/images/San cristobal de las casas.jpg",
    description: "Ciudad colonial rodeada de montañas con calles empedradas, casas de colores y una rica herencia indígena. Conoce sus iglesias históricas, mercados tradicionales y el centro cultural de Na Bolom.",
    tags: {
      primary: {
        label: "Pueblo Mágico",
        color: "chiapas-red"
      },
      secondary: {
        label: "Cultural",
        color: "chiapas-dark"
      }
    }
  },
  {
    id: "canon-sumidero",
    name: "Cañón del Sumidero",
    image: "/images/Cañon del sumidero.jpg",
    description: "Impresionante formación geológica con paredes de hasta 1,000 metros de altura. Disfruta de un paseo en lancha para admirar cascadas, flora y fauna local en este parque nacional emblemático.",
    tags: {
      primary: {
        label: "Natural",
        color: "chiapas-green"
      },
      secondary: {
        label: "Aventura",
        color: "chiapas-dark"
      }
    }
  },
  {
    id: "palenque",
    name: "Zona Arqueológica de Palenque",
    image: "/images/Palenque.jpg",
    description: "Antigua ciudad maya rodeada de selva tropical, con impresionantes templos y palacios. Destaca el Templo de las Inscripciones, donde se descubrió la tumba del rey Pakal.",
    tags: {
      primary: {
        label: "Patrimonio Mundial",
        color: "chiapas-red"
      },
      secondary: {
        label: "Arqueológico",
        color: "chiapas-dark"
      }
    }
  },
  {
    id: "agua-azul",
    name: "Cascadas de Agua Azul",
    image: "/images/Cascadas de Agua Azu.jpg",
    description: "Serie de cataratas escalonadas con agua de color turquesa, rodeadas de exuberante vegetación. Un paraíso natural perfecto para nadar, caminar por senderos y admirar la biodiversidad.",
    tags: {
      primary: {
        label: "Natural",
        color: "chiapas-green"
      },
      secondary: {
        label: "Ecoturismo",
        color: "chiapas-dark"
      }
    }
  },
  {
    id: "lagos-montebello",
    name: "Lagos de Montebello",
    image: "/images/Lagunas de montebello.jpg",
    description: "Conjunto de más de 50 lagos de diferentes colores, desde turquesa hasta esmeralda. Un espectáculo natural único donde puedes practicar kayak, natación y senderismo en un entorno prístino.",
    tags: {
      primary: {
        label: "Parque Nacional",
        color: "chiapas-green"
      },
      secondary: {
        label: "Naturaleza",
        color: "chiapas-dark"
      }
    }
  },
  {
    id: "chiapa-corzo",
    name: "Chiapa de Corzo",
    image: "/images/Chiapas de corzo.jpg",
    description: "Pintoresco pueblo colonial y punto de partida para visitar el Cañón del Sumidero. Conocido por su fuente mudéjar, tradiciones como la Fiesta Grande y deliciosa gastronomía tradicional.",
    tags: {
      primary: {
        label: "Pueblo Mágico",
        color: "chiapas-red"
      },
      secondary: {
        label: "Cultural",
        color: "chiapas-dark"
      }
    }
  }
];
