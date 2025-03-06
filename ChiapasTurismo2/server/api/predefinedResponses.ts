// Respuestas predefinidas para las preguntas más comunes sobre Chiapas
// Este enfoque garantiza respuestas consistentes y precisas

export interface PredefinedResponse {
  response: string;
  attractions: Array<{
    name: string;
    description: string;
    location: string;
    coordinates: {lat: number; lng: number};
  }>;
}

// Respuestas para preguntas sobre transporte
export const transporteRespuestas: {[key: string]: PredefinedResponse} = {
  "zacatecas_tuxtla": {
    response: `Para viajar de Zacatecas a Tuxtla Gutiérrez tienes estas opciones:

• ✈️ AVIÓN (opción más rápida):
  - Aerolínea: Volaris con escala en CDMX
  - Duración total: ~5-6 horas
  - Precio aproximado: $3,000-5,000 MXN
  - Frecuencia: 2 vuelos diarios

• 🚌 AUTOBÚS (más económico):
  - Línea: Omnibus de México o ETN
  - Ruta: Zacatecas → CDMX (12h) + CDMX → Tuxtla (14h)
  - Precio total: ~$1,800-2,400 MXN
  - Duración total: 26-30 horas con escala

Para moverte ya en Chiapas desde Tuxtla a San Cristóbal:
- Autobuses OCC/ADO: $80 MXN, salen cada 30 minutos
- Colectivos desde Terminal de Colectivos: $50 MXN, salen cuando se llenan`,
    attractions: [
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      }
    ]
  },
  
  "tulum_sancris": {
    response: `Para viajar de Tulum a San Cristóbal de las Casas tienes estas opciones:

• ✈️ AVIÓN (más rápido):
  - Vuela de Cancún a Tuxtla Gutiérrez (no hay vuelos directos desde Tulum)
  - Aerolíneas: Volaris, Viva Aerobus
  - Duración: 2 horas
  - Precio: $1,200-2,500 MXN aproximadamente
  - Desde aeropuerto de Tuxtla a San Cristóbal: transporte colectivo ($150 MXN) o taxi ($600 MXN), 1 hora.

• 🚌 AUTOBÚS (más económico):
  - ADO desde Tulum a Palenque: 8-9 horas, $650-900 MXN
  - Transbordo en Palenque a San Cristóbal: 5 horas, $300-400 MXN
  - Duración total: 14-15 horas
  - Recomendado: Viaje nocturno para aprovechar el tiempo

• 🚗 AUTO RENTADO:
  - Distancia: aproximadamente 900 km
  - Tiempo de manejo: 12-13 horas
  - Costo aproximado: $1,500-2,000 MXN + casetas + gasolina`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      }
    ]
  },
  
  "chamula_sancris": {
    response: `Para llegar de San Cristóbal de las Casas a San Juan Chamula:

• 🚐 TRANSPORTE COLECTIVO (económico):
  - Ubicación: Terminal de colectivos en Av. Insurgentes, junto al mercado municipal
  - Costo: $25 MXN por persona (un solo trayecto)
  - Horario: Salen cada 15-20 minutos desde las 7:00 AM hasta las 7:00 PM
  - Duración: 20-25 minutos
  - El colectivo te deja en la plaza principal de Chamula

• 🚕 TAXI (más cómodo):
  - Desde cualquier punto de San Cristóbal
  - Costo: $150-200 MXN (un solo trayecto), negociable
  - Servicio de ida y vuelta con espera: $400-500 MXN (negociar tiempo de espera)

• 🚶‍♂️ TOUR GUIADO (más completo):
  - Precio: $250-400 MXN por persona
  - Incluye: Transporte, guía y visita a Zinacantán
  - Agencias: Siyaj Chan, Jovel Explorer o Alex y Raúl Tours en el centro de San Cristóbal

Importante: Para visitar la iglesia de San Juan Chamula se cobra una cuota de $25 MXN y no se permiten fotografías en el interior.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "San Juan Chamula",
        description: "Comunidad indígena tzotzil con tradiciones únicas",
        location: "Chiapas, México", 
        coordinates: { lat: 16.7903, lng: -92.6860 }
      }
    ]
  },

  "villahermosa_tuxtla": {
    response: `Para viajar de Villahermosa a Tuxtla Gutiérrez:

• 🚌 AUTOBÚS ADO (opción más común):
  - Terminal: ADO Villahermosa
  - Líneas: ADO Primera Clase o ADO GL
  - Duración: 3-3.5 horas
  - Precio: $250-450 MXN dependiendo de la clase
  - Frecuencia: Aproximadamente cada hora entre 5:00 AM y 9:00 PM
  - Servicios: Aire acondicionado, baño, enchufes (en GL)

• 🚗 AUTO RENTADO:
  - Distancia: 150 km aproximadamente
  - Tiempo: 2.5 horas
  - Ruta: Carretera Federal 195 (en buen estado)
  - Casetas: Ninguna en esta ruta

• 🚐 TRANSPORTES REGIONALES:
  - Líneas: OCC, AU
  - Precio: $180-250 MXN
  - Ventaja: Más frecuencias pero menos comodidades

Una vez en Tuxtla, para ir a San Cristóbal hay autobuses cada 30 minutos (1 hora de viaje, $80 MXN) desde la terminal o colectivos más económicos ($50 MXN).`,
    attractions: [
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      }
    ]
  },
  
  "transporte_general": {
    response: `Para moverte por Chiapas tienes estas opciones:

• 🚌 AUTOBUSES OCC/ADO:
  - Mejor opción para rutas largas entre ciudades principales
  - Tuxtla-San Cristóbal: $80 MXN (1 hora, cada 30 minutos)
  - San Cristóbal-Palenque: $250-300 MXN (5 horas, varios horarios)
  - Tuxtla-Comitán: $180 MXN (2.5 horas)
  - Terminales en todas las ciudades principales

• 🚐 COLECTIVOS/COMBIS:
  - Económicos para trayectos cortos entre pueblos
  - 30-50% más baratos que autobuses
  - San Cristóbal-Chamula: $25 MXN (20 minutos)
  - San Cristóbal-Zinacantán: $20 MXN (15 minutos)
  - Tuxtla-Chiapa de Corzo: $15 MXN (20 minutos)

• 🚕 TAXIS COLECTIVOS:
  - Opción intermedia entre colectivo y taxi privado
  - Salen cuando completan 4 pasajeros
  - Más rápidos que colectivos pero más económicos que taxis privados

• 🚗 RENTA DE AUTO:
  - Desde $800 MXN/día
  - Recomendado para mayor libertad de movimiento
  - Necesario para llegar a comunidades rurales`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      }
    ]
  }
};

// Respuestas para preguntas sobre hoteles
export const hotelesRespuestas: {[key: string]: PredefinedResponse} = {
  "hoteles_sancristobal": {
    response: `Hoteles recomendados en San Cristóbal de las Casas:

• 🏨 ECONÓMICOS ($300-800 MXN):
  - Rossco Backpackers: Desde $250-350 MXN en dormitorio. Real de Guadalupe 22. Excelente ubicación, cocina, terraza.
  - Posada del Abuelito: Desde $300-450 MXN. Francisco I. Madero 38. Ambiente familiar, céntrico.
  - Hostal Casa Gaia: Desde $200-300 MXN. María Adelina Flores 47. Ambiente bohemio, desayuno incluido.

• 🏨 GAMA MEDIA ($800-1,800 MXN):
  - Hotel Casa Vieja: Desde $800-1,200 MXN. Real de Guadalupe 24. Estilo colonial, céntrico.
  - Hotel Posada del Carmen: Desde $700-1,000 MXN. Av. 16 de Septiembre 33. Pequeña alberca en patio.
  - Hotel Diego de Mazariegos: Desde $1,200-1,800 MXN. Diego de Mazariegos 39. Con restaurante.

• 🏨 GAMA ALTA ($1,800-3,500 MXN):
  - Hotel Bo: Desde $2,500-3,500 MXN. Calzada Antonio Ramírez 12. Diseño contemporáneo, alberca climatizada.
  - Casa del Alma: Desde $2,000-3,000 MXN. 28 de Agosto 1. Boutique, spa.
  - Hotel Museo Na Bolom: Desde $1,800-2,500 MXN. Vicente Guerrero 33. Casa-museo histórica.

Recomendación: Reserva con anticipación, especialmente en temporada alta (diciembre-enero, Semana Santa y verano).`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      }
    ]
  },
  
  "hostales_sancristobal": {
    response: `Hostales y hoteles económicos en San Cristóbal de las Casas:

• 🏨 HOSTALES (más económicos):
  - Puerta Vieja Hostel: Desde $190 MXN/noche en dormitorio compartido. Ubicado en Calle Comitán 13, barrio El Cerrillo. Incluye desayuno ligero y cocina.
  - Rossco Backpackers: Desde $250 MXN/noche. Ubicado en Real de Guadalupe 22. Excelente ubicación, cocina, terraza.
  - Posada del Abuelito: Desde $300 MXN/noche. Ubicación céntrica en Francisco I. Madero 38. Ambiente familiar.

• 🏨 HOTELES ECONÓMICOS:
  - Hotel Jardín del Cerrillo: Desde $500 MXN habitación doble. Calle Cerrillo 4, con jardín y desayuno.
  - Hotel Posada Jovel: Desde $550 MXN. Ubicado en Calle Diego Duguelay 1, a 5 minutos del centro.
  - Hotel Mision Colonial: Desde $700 MXN. Ubicado en Calle 16 de Septiembre 13. Estilo colonial con patios.

• 🏨 HOTELES SENCILLOS CON ALBERCA:
  - Hotel Jardín de las Orquídeas: Desde $900 MXN. En Callejón de las Orquídeas 8, alberca al aire libre.
  - Hotel Parador San Juan de Dios: Desde $1,200 MXN. Alberca cubierta, calefacción, a 15 minutos del centro.

Recomendación: Reserva con anticipación, especialmente en temporada alta (diciembre-enero y Semana Santa).`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      }
    ]
  },
  
  "hoteles_alberca_sancristobal": {
    response: `Hoteles con alberca en San Cristóbal de las Casas:

• 🏊‍♂️ HOTELES BOUTIQUE CON ALBERCA:
  - Hotel Bo: Alberca climatizada exterior. Desde $2,800 MXN/noche. Calzada Antonio Ramírez 12. Lujoso estilo contemporáneo.
  - Hotel Casavieja: Pequeña alberca climatizada interior. Desde $1,800 MXN. Real de Guadalupe 24. Estilo colonial recuperado.
  - Parador San Juan de Dios: Alberca cubierta climatizada. Desde $1,200 MXN. Barrio El Cerrillo, a 10 minutos del centro.

• 🏊‍♂️ HOTELES DE GAMA MEDIA CON ALBERCA:
  - Hotel Ciudad Real Centro Histórico: Alberca cubierta climatizada. Desde $1,100 MXN. Plaza 31 de Marzo 10.
  - Hotel Jardín de las Orquídeas: Alberca pequeña exterior (no climatizada). Desde $900 MXN. Ubicado en Callejón de las Orquídeas.
  - Hotel La Posada del Carmen: Pequeña alberca en patio. Desde $900 MXN. Av. 16 de Septiembre 33.

IMPORTANTE: Debido al clima fresco de San Cristóbal (10-22°C), la mayoría de albercas están climatizadas o cubiertas. Las albercas exteriores no climatizadas pueden estar muy frías, especialmente de noviembre a febrero.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      }
    ]
  },
  
  "hoteles_tuxtla": {
    response: `Hoteles económicos en Tuxtla Gutiérrez:

• 🏨 HOSTALES Y ECONÓMICOS:
  - Hostal Tres Central: Desde $250 MXN/noche en dormitorio. Ubicado en 1a Calle Poniente Norte 165. Incluye cocina compartida.
  - Hotel Santa María: Desde $400 MXN habitación doble. 2a Av. Norte Poniente 751, cerca del centro.
  - Hotel El Carmen: Desde $500 MXN. En Av. Central Poniente 460, cerca del parque central.

• 🏨 HOTELES CON MEJOR RELACIÓN CALIDAD-PRECIO:
  - Hotel Mango: Desde $600 MXN. Ubicado en Blvd. Belisario Domínguez 950. Con alberca pequeña.
  - Hotel Madrid: Desde $650 MXN. En 1a Av. Sur 265, zona comercial, incluye desayuno.
  - One Tuxtla Gutiérrez: Desde $800 MXN. En Boulevard Dr. Belisario Domínguez 1691, estándar de cadena.

• 🏨 HOTELES CON ALBERCA:
  - Hotel Fiesta Inn: Desde $1,200 MXN. Boulevard Belisario Domínguez 1691, con alberca en azotea.
  - Sleep Inn: Desde $1,000 MXN. Boulevard Dr. Belisario Domínguez 1254, con alberca.
  - Holiday Inn: Desde $1,400 MXN. Boulevard Dr. Belisario Domínguez 1195, alberca y gimnasio.

La mayoría de hoteles económicos están cerca del centro o sobre el Boulevard Belisario Domínguez.`,
    attractions: [
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      }
    ]
  }
};

// Respuestas para preguntas sobre restaurantes
export const restaurantesRespuestas: {[key: string]: PredefinedResponse} = {
  "restaurantes_sancristobal_economicos": {
    response: `Restaurantes económicos en San Cristóbal por menos de $200 por persona:

• 🍽️ COMIDA REGIONAL:
  - TierrAdentro Cocina Chiapaneca: $120-180 MXN. Real de Guadalupe 24. Prueba su sopa de pan o cochito horneado.
  - Cocoliche: $100-150 MXN. Real de Guadalupe 3. Fusión mexicana, tailandesa y platos vegetarianos.
  - El Caldero: $80-120 MXN. Diego de Mazariegos 84. Caldos y comida regional a buen precio.

• 🍽️ COMIDA MEXICANA:
  - La Lupe: $100-180 MXN. Av. Insurgentes 33. Tacos y botanas mexicanas con buena calidad/precio.
  - El Fogón: $80-140 MXN. Insurgentes 16. Económico con platos del día.
  - Marchanta: $120-180 MXN. Real de Guadalupe 53. Tacos y antojitos mexicanos.

• 🍽️ INTERNACIONALES:
  - Napoli Pizza: $80-120 MXN por persona. Varias sucursales. Pizza y pasta económica.
  - Banyan Árbol de la Vida: $90-150 MXN. Real de Guadalupe 45. Vegetariano/vegano bien de precio.
  - Sarajevo Café Refugio: $80-140 MXN. Calle Real de Mexicanos 11. Desayunos económicos y café.

• 🍽️ MERCADOS:
  - Mercado Municipal: $50-80 MXN. Excelentes comedores populares con plato del día.
  - Mercado de Dulces y Artesanías: Pequeños comedores con antojitos desde $30 MXN.

Todos estos lugares ofrecen comida de calidad a buen precio, ambiente casual y están ubicados en el centro o cerca de él.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      }
    ]
  },
  
  "restaurantes_tuxtla": {
    response: `Restaurantes recomendados en Tuxtla Gutiérrez:

• 🍽️ COCINA CHIAPANECA TRADICIONAL:
  - El Mesón del Asador: Excelente cochito horneado. $200-350 MXN. Blvd. Belisario Domínguez 940.
  - La Paloma: Comida regional amplio menú. $150-300 MXN. 8a Norte Poniente 236.
  - Restaurante Vitoria: Cocina chiapaneca tradicional. $200-350 MXN. Av. Central Poniente 627.

• 🍽️ MARISCOS (especialidad local):
  - Marisquería El Huachinango: Pescados y mariscos frescos. $180-350 MXN. Blvd. Belisario Domínguez 773.
  - El Pescador: Marisquería tradicional. $200-400 MXN. Blvd. Belisario Domínguez 2076.
  - Mariscos La Jaiba: Excelente relación calidad/precio. $150-300 MXN. 9a Sur Oriente 335.

• 🍽️ ECONÓMICOS:
  - Café Avenida: Comida casera a buen precio. $80-150 MXN. Av. Central Poniente 476.
  - La Canasta: Platillos económicos tipo "comida corrida". $70-120 MXN. 1a Av. Norte 221.
  - Mercado 20 de Noviembre: Comedores populares con platillos desde $60 MXN.

• 🍽️ INTERNACIONALES/GOURMET:
  - El Mandarin: Cocina oriental. $150-300 MXN. Blvd. Belisario Domínguez 2081.
  - La Diferencia: Fusión mexicana-internacional. $250-400 MXN. Blvd. Belisario Domínguez 671.

Para probar la auténtica gastronomía chiapaneca, recomiendo los platillos: cochito horneado, chipilín con bolita, tamales juacanes y pozol.`,
    attractions: [
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      }
    ]
  },
  
  "gastronomia_general": {
    response: `Gastronomía chiapaneca y dónde probarla:

• 🍲 SAN CRISTÓBAL DE LAS CASAS:
  - TierrAdentro: Cocina chiapaneca auténtica. Especialidad: sopa de pan. $120-250 MXN. Real de Guadalupe 24.
  - El Fogón de Jovel: Cocina chiapaneca contemporánea. $180-350 MXN. Av. 16 de Septiembre 28.
  - El Mesón del Taco: Antojitos mexicanos y chiapanecos. $100-200 MXN. Insurgentes 19.
  - La Lupe: Tacos y botanas mexicanas. $100-180 MXN. Av. Insurgentes 33.

• 🍲 TUXTLA GUTIÉRREZ:
  - El Mesón del Asador: Famoso por su cochito horneado. $200-350 MXN. Blvd. Belisario Domínguez 940.
  - La Paloma: Comida regional. $150-300 MXN. 8a Norte Poniente 236.
  - Marisquería El Huachinango: Excelentes mariscos. $180-350 MXN. Blvd. Belisario Domínguez 773.

• 🍲 CHIAPA DE CORZO:
  - Las Pichanchas: Comida tradicional con folklore. $150-250 MXN. Av. 21 de Octubre.
  - Restaurante Kondó: Comida regional con vista al río. $130-250 MXN. Malecón s/n.

• 🍲 PLATILLOS IMPRESCINDIBLES:
  - Cochito horneado: Cerdo marinado y horneado
  - Sopa de pan: Exclusiva de San Cristóbal
  - Tamales juacanes: Rellenos de frijol y chipilín
  - Queso bola de Ocosingo: Queso con doble maduración
  - Pozol: Bebida refrescante de maíz y cacao
  - Comiteco: Licor tradicional de agave`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Chiapa de Corzo",
        description: "Pueblo colonial cerca del Cañón del Sumidero",
        location: "Chiapas, México",
        coordinates: { lat: 16.7073, lng: -93.0153 }
      }
    ]
  }
};

// Respuestas para preguntas sobre clima
export const climaRespuestas: {[key: string]: PredefinedResponse} = {
  "clima_general": {
    response: `Clima en Chiapas por regiones:

• 🌡️ LOS ALTOS (San Cristóbal): Clima templado y fresco
  - Temporada seca (nov-abril): 5-22°C, días soleados, noches muy frías
  - Temporada lluviosa (mayo-oct): 8-20°C, precipitaciones frecuentes
  - Necesitas ropa abrigadora todo el año, especialmente para las noches
  - Las mañanas pueden tener neblina, especialmente en verano

• 🌡️ DEPRESIÓN CENTRAL (Tuxtla, Chiapa de Corzo): Clima cálido
  - Temporada seca (nov-abril): 15-33°C, caluroso y seco
  - Temporada lluviosa (mayo-oct): 18-32°C, caluroso y húmedo
  - Ropa ligera y protección solar recomendadas todo el año

• 🌡️ SELVA (Palenque, Lacandona): Clima tropical húmedo
  - Temporada seca (nov-abril): 18-32°C, caluroso con humedad moderada
  - Temporada lluviosa (mayo-oct): 22-33°C, muy húmedo con lluvias fuertes
  - Necesitas repelente, ropa ligera e impermeable

• 🌧️ MEJOR ÉPOCA PARA VISITAR:
  - Noviembre a abril: Temporada ideal con clima estable y menos lluvias
  - Diciembre-enero: Temporada alta (precios más altos, reservar con anticipación)
  - Semana Santa: Clima agradable pero mucho turismo nacional
  - Septiembre: Mes más lluvioso, mejor evitarlo para excursiones`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      }
    ]
  },
  
  "clima_abril": {
    response: `Clima en Chiapas durante abril:

• 🌡️ SAN CRISTÓBAL DE LAS CASAS (2,200 msnm):
  - Abril: 8-22°C, inicio de lluvias ocasionales
  - Noches frescas, llevar ropa abrigadora
  - Días generalmente soleados con baja probabilidad de lluvia
  - Excelente mes para visitar la ciudad y alrededores

• 🌡️ TUXTLA GUTIÉRREZ (500 msnm):
  - Abril: 20-34°C, clima cálido y seco
  - Muy caluroso durante el día
  - Ropa ligera, protector solar y sombrero indispensables
  - Ideal para visitar el Cañón del Sumidero

• 🌡️ PALENQUE (60 msnm):
  - Abril: 20-33°C, caluroso y húmedo
  - Posibilidad de lluvias ocasionales
  - Zona arqueológica mejor visitarla temprano (8-10 AM)
  - Llevar repelente, sombrero, ropa ligera y agua

• 🌧️ PRECIPITACIONES EN ABRIL:
  - San Cristóbal: Lluvia ligera ocasional (promedio 5-7 días al mes)
  - Tuxtla: Precipitaciones escasas, mayormente seco
  - Palenque: Posibilidad de lluvias breves por la tarde

Abril es considerado uno de los mejores meses para visitar Chiapas, pues combina clima agradable con menor afluencia turística que en temporada alta de invierno y Semana Santa.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      }
    ]
  },
  
  "clima_diciembre": {
    response: `Clima en Chiapas durante diciembre (invierno):

• 🌡️ SAN CRISTÓBAL DE LAS CASAS (2,200 msnm):
  - Temperatura: 4-20°C, con posibilidad de 0°C en madrugadas
  - Días soleados pero muy frescos
  - Noches frías que requieren abrigo pesado, guantes y gorro
  - Ocasionalmente hay heladas en diciembre-enero

• 🌡️ TUXTLA GUTIÉRREZ (500 msnm):
  - Temperatura: 15-28°C, clima primaveral
  - Días cálidos y noches frescas agradables
  - Ideal para actividades al aire libre y visitar el Cañón del Sumidero

• 🌡️ PALENQUE (60 msnm):
  - Temperatura: 18-29°C, clima cálido moderado
  - Menor humedad que en otros meses
  - Mejor temporada para explorar las ruinas sin agotarse

• ☀️ PRECIPITACIONES:
  - Temporada seca con mínimas precipitaciones
  - Mayor visibilidad para fotografía
  - Cascadas con menor cauce pero agua más turquesa

Temporada alta turística: Los precios suben, especialmente 20 diciembre-6 enero. Reserva alojamiento con anticipación. El periodo entre 7 enero-febrero ofrece buen clima y menos turistas.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      }
    ]
  }
};

// Respuestas para preguntas sobre actividades
export const actividadesRespuestas: {[key: string]: PredefinedResponse} = {
  "lugares_sancristobal": {
    response: `Mejores lugares para visitar en San Cristóbal de las Casas:

• 🏛️ CENTRO HISTÓRICO:
  - Catedral de San Cristóbal: Fachada amarilla distintiva. Abierta 8:00-20:00, entrada libre.
  - Templo y Ex-Convento de Santo Domingo: Impresionante fachada barroca. Abierto 8:00-20:00, entrada libre.
  - Andador Eclesiástico y Andador Guadalupano: Calles peatonales con tiendas y cafés.
  - Arco del Carmen: Monumento histórico que marca la entrada a la ciudad antigua.

• 🏛️ MUSEOS:
  - Museo del Ámbar: Exhibición sobre el ámbar chiapaneco. $30 MXN. 10:00-18:00. Diego de Mazariegos s/n.
  - Na Bolom: Antigua casa de Frans y Trudi Blom. $50 MXN. 9:00-19:00. Vicente Guerrero 33.
  - Museo de las Culturas Populares: Cultura indígena chiapaneca. $20 MXN. 9:00-18:00. Av. Ángel Albino Corzo 2.

• 🌄 MIRADORES:
  - Cerro de San Cristóbal: Vista panorámica a 15 minutos caminando desde el centro.
  - Cerro de Guadalupe: Iglesia blanca con vista panorámica. Especialmente bonito al atardecer.

• 🏙️ ALREDEDORES:
  - San Juan Chamula: Comunidad indígena con iglesia única. A 10km, $25 MXN en colectivo.
  - Zinacantán: Pueblo tzotzil famoso por textiles. A 10km, $20 MXN en colectivo.
  - El Arcotete: Parque natural con tirolesa y formaciones rocosas. A 15min, $10 entrada.
  - Cañón del Sumidero: Tour desde San Cristóbal por $600 MXN aproximadamente.

La mayoría de atracciones en el centro se pueden visitar caminando. Para los alrededores, recomiendo tour guiado o colectivos.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "San Juan Chamula",
        description: "Comunidad indígena tzotzil con tradiciones únicas",
        location: "Chiapas, México", 
        coordinates: { lat: 16.7903, lng: -92.6860 }
      },
      {
        name: "Zinacantán",
        description: "Comunidad tzotzil famosa por sus textiles",
        location: "Chiapas, México",
        coordinates: { lat: 16.7676, lng: -92.7085 }
      }
    ]
  },
  
  "lugares_tuxtla": {
    response: `Mejores lugares para visitar en Tuxtla Gutiérrez:

• 🏞️ ATRACCIONES NATURALES:
  - Cañón del Sumidero: Imprescindible. Tour en lancha desde embarcadero en Chiapa de Corzo. $300 MXN por persona. 8:00-16:00.
  - Miradores del Cañón: 5 miradores en la carretera panorámica. Entrada libre. Mejores vistas por la mañana.
  - Zoológico Miguel Álvarez del Toro (ZooMAT): Uno de los mejores de México, especializado en fauna chiapaneca. $40 MXN. 9:00-16:30. Cerrado lunes.

• 🏙️ CENTRO URBANO:
  - Parque de la Marimba: Conciertos gratuitos de marimba cada tarde/noche. 18:00-22:00.
  - Museo Regional de Chiapas: Historia y arqueología del estado. $75 MXN. 9:00-18:00. Cerrado lunes.
  - Catedral de San Marcos: Principal iglesia de la ciudad. Entrada libre. 7:00-20:00.
  - Plaza Cívica: Centro histórico de la ciudad con edificios gubernamentales.

• 👨‍👩‍👧‍👦 PARA FAMILIAS:
  - Parque Joyyo Mayu: Parque ecológico con tirolesa y actividades. $40 MXN entrada.
  - Centro de Convivencia Infantil: Parque con juegos, tren y lago. $15 MXN.
  - Planetario Jaime Sabines: Proyecciones astronómicas. $30 MXN. Viernes-domingo.

• 📍 ALREDEDORES:
  - Chiapa de Corzo (20 min): Pueblo Mágico colonial, punto de partida para el Cañón.
  - Cascada El Chorreadero (30 min): Cascada donde puedes nadar. $50 MXN entrada.

Una visita completa a Tuxtla requiere 2-3 días incluyendo un día dedicado al Cañón del Sumidero.`,
    attractions: [
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Cañón del Sumidero",
        description: "Impresionante cañón con paredes de hasta 1000 metros",
        location: "Chiapas, México",
        coordinates: { lat: 16.8513, lng: -93.0777 }
      },
      {
        name: "Chiapa de Corzo",
        description: "Pueblo colonial cerca del Cañón del Sumidero",
        location: "Chiapas, México",
        coordinates: { lat: 16.7073, lng: -93.0153 }
      }
    ]
  },
  
  "lugares_palenque": {
    response: `Mejores lugares para visitar en Palenque:

• 🏯 ZONA ARQUEOLÓGICA DE PALENQUE:
  - Principal atracción, Patrimonio de la Humanidad UNESCO
  - Horario: 8:00-17:00 (último acceso 16:30)
  - Precio: $80 MXN entrada + $45 MXN permiso video/foto
  - Imprescindibles: Templo de las Inscripciones, El Palacio, Templo de la Cruz
  - Recomendación: Visitar temprano (8-10am) para evitar calor y multitudes
  - Guías certificados disponibles en la entrada: $600-800 MXN por grupo

• 🌊 CASCADAS CERCANAS:
  - Cascadas de Agua Azul: A 60 km (1:15h). $40 MXN entrada. Aguas turquesas escalonadas.
  - Cascada de Misol-Ha: A 20 km (25min). $30 MXN entrada. Caída de 30m con cueva detrás.
  - Roberto Barrios: A 25 km (40min). $20 MXN entrada. Menos turístico.
  - Tours combinados desde Palenque: $400-600 MXN incluyendo transporte.

• 🌳 NATURALEZA:
  - Aluxes Ecoparque: Santuario de animales. $150 MXN. A 5 km de la ciudad.
  - Selva Lacandona: Tours de día completo a Las Guacamayas. Desde $1,200 MXN.

• 🏙️ CIUDAD DE PALENQUE:
  - Pequeña ciudad con servicios básicos para turistas
  - Mercado Municipal: Artesanías y productos locales
  - Parque Central: Pequeña plaza con ambiente local

Recomendación: Mínimo 2 días completos, uno para la zona arqueológica y otro para las cascadas. El mejor tour: "Palenque + Misol-Ha + Agua Azul" ($500-600 MXN).`,
    attractions: [
      {
        name: "Palenque",
        description: "Zona arqueológica maya en la selva",
        location: "Chiapas, México",
        coordinates: { lat: 17.4838, lng: -92.0436 }
      },
      {
        name: "Agua Azul",
        description: "Cascadas turquesas cerca de Palenque",
        location: "Chiapas, México",
        coordinates: { lat: 17.2514, lng: -92.1133 }
      }
    ]
  },
  
  "actividades_familias": {
    response: `Actividades familiares recomendadas en Chiapas:

• 🏞️ NATURALEZA PARA FAMILIAS:
  - Cañón del Sumidero: Tour en lancha desde Chiapa de Corzo. $300 MXN adultos, $150 MXN niños. Ver cocodrilos y monos.
  - Cascadas El Chiflón: Sendero accesible con varias cascadas. $50 MXN. Piscinas naturales para refrescarse.
  - Lagos de Montebello: Lagos multicolores con áreas para picnic y paseos en balsa. $45 MXN entrada.
  - El Arcotete (San Cristóbal): Parque natural con tirolesa, puentes colgantes y grutas. $10 MXN entrada.

• 🦁 ZOOLÓGICOS Y ANIMALES:
  - Zoológico Miguel Álvarez del Toro (Tuxtla): Uno de los mejores de México. $40 MXN adultos, $20 MXN niños.
  - Aluxes Ecoparque (Palenque): Santuario de animales rescatados. $150 MXN.

• 🏛️ MUSEOS INTERACTIVOS:
  - Museo del Ámbar (San Cristóbal): Exhibición interactiva. $30 MXN.
  - Kakaw Museo del Chocolate (San Cristóbal): Historia del chocolate con degustaciones. $40 MXN.
  - Planetario Jaime Sabines (Tuxtla): Proyecciones astronómicas. $30 MXN.

• 🚂 PARQUES:
  - Centro de Convivencia Infantil (Tuxtla): Juegos, tren y actividades. $15 MXN.
  - Parque Joyyo Mayu (Tuxtla): Ecológico con tirolesa. $40 MXN entrada.

• 👶 CONSIDERACIONES POR EDAD:
  - Niños pequeños (2-5 años): Zoológico, parques, paseos cortos
  - Niños medianos (6-9): Todas las opciones adaptando ritmo
  - Niños grandes y adolescentes (10+): Ideal para ruinas y aventuras como tirolesas

Las distancias en Chiapas pueden ser largas. Planifica máximo 1-2 actividades principales por día con niños.`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Tuxtla Gutiérrez",
        description: "Capital de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7521, lng: -93.1152 }
      },
      {
        name: "Cañón del Sumidero",
        description: "Impresionante cañón con paredes de hasta 1000 metros",
        location: "Chiapas, México",
        coordinates: { lat: 16.8513, lng: -93.0777 }
      },
      {
        name: "Chiapa de Corzo",
        description: "Pueblo colonial cerca del Cañón del Sumidero",
        location: "Chiapas, México",
        coordinates: { lat: 16.7073, lng: -93.0153 }
      }
    ]
  },
  
  "artesanias": {
    response: `Guía de artesanías típicas de Chiapas y dónde comprarlas:

• 🧵 TEXTILES:
  - Productos: Huipiles, blusas bordadas, chales, tapetes, rebozos
  - Lugares: 
    * San Cristóbal: Mercado de Santo Domingo, Cooperativa Sna Jolobil, Tienda J'pas Joloviletik
    * Zinacantán: Talleres familiares (a 10km de San Cristóbal)
    * San Juan Chamula: Mercado principal (domingos)
  - Precios: Desde $200 MXN (pequeñas piezas) hasta $3,000 MXN (huipiles elaborados)

• 💎 ÁMBAR:
  - Chiapas produce el mejor ámbar de México (semi-precioso)
  - Lugares:
    * San Cristóbal: Museo y Mercado del Ámbar (certificado), Calle Real de Guadalupe
    * Simojovel: Origen del ámbar, tiendas de productores
  - Cuidado: Evitar vendedores ambulantes (pueden vender plástico/copal)
  - Precios: $200-500 MXN (pequeñas piezas), $1,000+ MXN (joyas elaboradas)

• 🪑 LACA Y MADERA:
  - Técnica tradicional prehispánica de colores brillantes
  - Productos: Cajas, bateas, joyeros, muebles pequeños
  - Lugares: 
    * Chiapa de Corzo: Talleres y Museo de la Laca
    * San Cristóbal: Mercado de Artesanías
  - Precios: $150-300 MXN (piezas pequeñas), $500+ MXN (mayores)

• 🏺 ALFARERÍA:
  - Cerámica de barro negro y policromada
  - Lugar principal: Amatenango del Valle (a 35km de San Cristóbal)
  - Productos: Jaguares, jarrones, vajillas
  - Precios: $100-800 MXN dependiendo del tamaño

• 🛍️ MERCADOS PRINCIPALES:
  - San Cristóbal: Mercado de Santo Domingo (el mejor), Mercado de Artesanías
  - Tuxtla: Mercado de Artesanías (menos auténtico que San Cristóbal)
  - Regateo: Es normal y esperado, pero respeta el valor del trabajo artesanal`,
    attractions: [
      {
        name: "San Cristóbal",
        description: "Ciudad colonial en los altos de Chiapas",
        location: "Chiapas, México",
        coordinates: { lat: 16.7370, lng: -92.6376 }
      },
      {
        name: "Chiapa de Corzo",
        description: "Pueblo colonial cerca del Cañón del Sumidero",
        location: "Chiapas, México",
        coordinates: { lat: 16.7073, lng: -93.0153 }
      },
      {
        name: "San Juan Chamula",
        description: "Comunidad indígena tzotzil con tradiciones únicas",
        location: "Chiapas, México", 
        coordinates: { lat: 16.7903, lng: -92.6860 }
      },
      {
        name: "Zinacantán",
        description: "Comunidad tzotzil famosa por sus textiles",
        location: "Chiapas, México",
        coordinates: { lat: 16.7676, lng: -92.7085 }
      }
    ]
  }
};

// Respuesta general para cuando no hay coincidencia con ninguna pregunta específica
export const respuestaGeneral: PredefinedResponse = {
  response: `Información general sobre Chiapas:

• 🏙️ PRINCIPALES DESTINOS:
  - San Cristóbal de las Casas: Ciudad colonial en los altos, centro cultural
  - Tuxtla Gutiérrez: Capital del estado, moderna y punto de entrada
  - Palenque: Pueblo pequeño, puerta a ruinas mayas y selva
  - Chiapa de Corzo: Pueblo Mágico colonial, embarcadero para el Cañón

• 🏞️ ATRACCIONES NATURALES:
  - Cañón del Sumidero: Impresionante cañón con paredes de 1000m
  - Cascadas de Agua Azul: Cascadas turquesas escalonadas
  - Lagunas de Montebello: 59 lagos multicolores
  - Selva Lacandona: Una de las últimas selvas tropicales

• 🏯 ARQUEOLOGÍA:
  - Zona Arqueológica de Palenque: La más impresionante, Patrimonio UNESCO
  - Yaxchilán y Bonampak: Ciudades mayas en la selva

• 👨‍👩‍👧‍👦 CULTURAL:
  - San Juan Chamula: Comunidad indígena con rituales únicos
  - Zinacantán: Pueblo famoso por textiles coloridos

• 🚗 TRANSPORTE:
  - Autobuses ADO: Conectan todas las ciudades principales
  - Colectivos: Económicos para trayectos cortos
  - Renta de auto: Desde $800 MXN/día, recomendable para flexibilidad

• 🌡️ CLIMA:
  - San Cristóbal: Templado-frío (10-22°C), lleva abrigo
  - Tuxtla: Cálido (24-35°C), ropa ligera
  - Palenque: Tropical húmedo (22-33°C), repelente`,
  attractions: [
    {
      name: "San Cristóbal",
      description: "Ciudad colonial en los altos de Chiapas",
      location: "Chiapas, México",
      coordinates: { lat: 16.7370, lng: -92.6376 }
    },
    {
      name: "Palenque",
      description: "Zona arqueológica maya en la selva",
      location: "Chiapas, México",
      coordinates: { lat: 17.4838, lng: -92.0436 }
    },
    {
      name: "Tuxtla Gutiérrez",
      description: "Capital de Chiapas",
      location: "Chiapas, México",
      coordinates: { lat: 16.7521, lng: -93.1152 }
    },
    {
      name: "Cañón del Sumidero",
      description: "Impresionante cañón con paredes de hasta 1000 metros",
      location: "Chiapas, México",
      coordinates: { lat: 16.8513, lng: -93.0777 }
    },
    {
      name: "Agua Azul",
      description: "Cascadas turquesas cerca de Palenque",
      location: "Chiapas, México",
      coordinates: { lat: 17.2514, lng: -92.1133 }
    }
  ]
};