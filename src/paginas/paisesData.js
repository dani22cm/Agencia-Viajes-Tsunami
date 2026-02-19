
const destacados = [
  {
    code: 'ESP',
    name: 'España',
    image: '/images/paises/ESP.svg',
    description: 'Playas mediterráneas, ciudades históricas como Madrid, Barcelona y Sevilla, gastronomía reconocida y buena conectividad interna.',
    bestTime: 'Primavera y otoño (abril-junio, sept-oct)',
    topAttractions: ['Sagrada Família', 'La Alhambra', 'Parque Güell', 'La Rambla'],
    avgPrice: 'Desde 70€/noche',
    rating: 4.6,
    itinerary: [
      '3 días en Madrid: museos y gastronomía',
      '2 días en Sevilla: barrio de Triana y la catedral asdjhlsdjkfj',
      '4 días en costa mediterránea: Barcelona y playas'
    ],
    tips: ['Reservar entradas con antelación en verano', 'Probar tapas en mercados locales']
  },
  {
    code: 'JPN',
    name: 'Japón',
    image: '/images/paises/JPN.svg',
    description: 'Mezcla de tradición y vanguardia: templos, gastronomía única y transporte puntual. Ideal para itinerarios culturales y urbanos.',
    bestTime: 'Primavera (cerezos) y otoño',
    topAttractions: ['Kioto', 'Tokio', 'Monte Fuji', 'Nara'],
    avgPrice: 'Desde 120€/noche',
    rating: 4.8,
    itinerary: ['3-4 días en Tokio: barrios y excursiones', '2 días en Kioto: templos y geishas', 'Excursión al Monte Fuji'],
    tips: ['Comprar JR Pass si se viaja entre ciudades', 'Probar restaurantes con reserva']
  },
  {
    code: 'ARG',
    name: 'Argentina',
    image: '/images/paises/ARG.svg',
    description: 'Paisajes variados: Patagonia, cataratas del Iguazú, vida urbana en Buenos Aires y excelentes oportunidades de aventura.',
    bestTime: 'Primavera y verano (oct-mar)',
    topAttractions: ['Cataratas del Iguazú', 'Patagonia', 'Buenos Aires', 'Mendoza'],
    avgPrice: 'Desde 60€/noche',
    rating: 4.5,
    itinerary: ['Buenos Aires: 3 días urbanos', 'Patagonia: 5-7 días de trekking', 'Mendoza: 2 días en viñedos'],
    tips: ['Traer adaptador para enchufes locales', 'Reservar vuelos internos con antelación']
  },
  {
    code: 'THA',
    name: 'Tailandia',
    image: '/images/paises/THA.svg',
    description: 'Playas tropicales, cultura budista y excelente relación calidad-precio. Ideal para viajes de relax y aventura.',
    bestTime: 'Noviembre a febrero',
    topAttractions: ['Bangkok', 'Phuket', 'Chiang Mai', 'Islas Phi Phi'],
    avgPrice: 'Desde 40€/noche',
    rating: 4.4,
    itinerary: ['Bangkok: 2-3 días', 'Chiang Mai: 3 días en el norte', 'Islas: 4-6 días de playa'],
    tips: ['Respetar códigos de vestimenta en templos', 'Cuidado con el sol en las islas']
  },
  {
    code: 'FRA',
    name: 'Francia',
    image: '/images/paises/FRA.svg',
    description: 'Cultura, arte, gastronomía y regiones vinícolas. París como epicentro y costa mediterránea y Alpes para opciones variadas.',
    bestTime: 'Primavera y verano',
    topAttractions: ['Torre Eiffel', 'Museo del Louvre', 'Côtes de Provence', 'Valle del Loira'],
    avgPrice: 'Desde 100€/noche',
    rating: 4.7,
    itinerary: ['París: 3-4 días', 'Provenza: 2-3 días en la campiña', 'Valle del Loira: ruta de castillos'],
    tips: ['Aprovechar mercados locales para picnic', 'Reservar restaurantes en temporada alta']
  },
  {
    code: 'USA',
    name: 'Estados Unidos',
    image: '/images/paises/USA.svg',
    description: 'Gran diversidad: ciudades icónicas, parques nacionales y rutas panorámicas. Ideal para viajes a medida.',
    bestTime: 'Primavera y otoño (según región)',
    topAttractions: ['Nueva York', 'Parque Yellowstone', 'Gran Cañón', 'San Francisco'],
    avgPrice: 'Desde 90€/noche',
    rating: 4.6,
    itinerary: ['Nueva York: 3-4 días', 'Roadtrip por la Costa Oeste: 8-12 días', 'Visita a parques nacionales: 5-7 días'],
    tips: ['Alquilar coche para explorar zonas rurales', 'Reservar alojamiento cerca de parques con antelación']
  },
  {
    code: 'GBR',
    name: 'Reino Unido',
    image: '/images/paises/GBR.svg',
    description: 'Historia, museos y ciudades con encanto. Gran oferta cultural y conexiones rápidas entre ciudades.',
    bestTime: 'Primavera y verano',
    topAttractions: ['Londres', 'Edimburgo', 'Stonehenge', 'Bath'],
    avgPrice: 'Desde 95€/noche',
    rating: 4.3,
    itinerary: ['Londres: 3-4 días', 'Edimburgo: 2-3 días', 'Ruta por el suroeste: 3-5 días'],
    tips: ['Tarjeta Oyster para Londres', 'Comprobar horarios de trenes en temporada']
  },
  {
    code: 'GRC',
    name: 'Grecia',
    image: '/images/paises/GRC.svg',
    description: 'Islas idílicas, historia antigua y gastronomía mediterránea. Perfecto para relajarse y explorar patrimonio.',
    bestTime: 'Mayo-junio y septiembre',
    topAttractions: ['Atenas', 'Santorini', 'Mykonos', 'Creta'],
    avgPrice: 'Desde 60€/noche',
    rating: 4.5,
    itinerary: ['Atenas: 2 días', 'Santorini: 3 días', 'Islas populares: 5-7 días'],
    tips: ['Moverse en ferry entre islas', 'Reservar alojamiento frente al mar con antelación']
  },
  {
    code: 'PRT',
    name: 'Portugal',
    image: '/images/paises/PRT.svg',
    description: 'Cerca de España pero con personalidad propia: Lisboa, Oporto y playas del Algarve.',
    bestTime: 'Primavera y otoño',
    topAttractions: ['Lisboa', 'Oporto', 'Algarve', 'Sintra'],
    avgPrice: 'Desde 65€/noche',
    rating: 4.4,
    itinerary: ['Lisboa: 3 días', 'Oporto: 2 días', 'Algarve: 3-4 días de playa'],
    tips: ['Probar vinos locales en Oporto', 'Moverse en tranvía por zonas históricas']
  },
  {
    code: 'MAR',
    name: 'Marruecos',
    image: '/images/paises/MAR.svg',
    description: 'Cultura vibrante, medinas históricas, desierto y costa. Ideal para escapadas culturales y aventuras.',
    bestTime: 'Primavera y otoño',
    topAttractions: ['Marrakech', 'Fez', 'Sahara', 'Essaouira'],
    avgPrice: 'Desde 50€/noche',
    rating: 4.2,
    itinerary: ['Marrakech: 2-3 días', 'Excursión al desierto: 2 días', 'Fez y costa: 3-4 días'],
    tips: ['Regatear en mercados locales', 'Vestir de forma respetuosa en zonas tradicionales']
  },
  {
    code: 'AUS',
    name: 'Australia',
    image: '/images/paises/AUS.svg',
    description: 'Naturaleza única, playas y ciudades cosmopolitas. Recomendado para viajes largos y aventuras al aire libre.',
    bestTime: 'Septiembre-noviembre y marzo-mayo',
    topAttractions: ['Sídney', 'Gran Barrera de Coral', 'Melbourne', 'Tasmania'],
    avgPrice: 'Desde 110€/noche',
    rating: 4.6,
    itinerary: ['Sídney: 3 días', 'Gran Barrera de Coral: 3-4 días', 'Melbourne: 2-3 días'],
    tips: ['Reservar excursiones a arrecifes con antelación', 'Protegerse del sol']
  },
  {
    code: 'CAN',
    name: 'Canadá',
    image: '/images/paises/CAN.svg',
    description: 'Espacios naturales inmensos, ciudades limpias y actividades al aire libre todo el año.',
    bestTime: 'Verano para parques; invierno para deportes de nieve',
    topAttractions: ['Banff', 'Vancouver', 'Toronto', 'Niagara Falls'],
    avgPrice: 'Desde 95€/noche',
    rating: 4.5,
    itinerary: ['Toronto: 2-3 días', 'Ruta a Banff: 4-6 días', 'Vancouver: 2-3 días'],
    tips: ['Reservar alojamiento en parques nacionales con antelación', 'Vestir por capas']
  },
  {
    code: 'MEX',
    name: 'México',
    image: '/images/paises/MEX.svg',
    description: 'Rica gastronomía, patrimonio prehispánico y playas en la Riviera Maya.',
    bestTime: 'Noviembre a abril',
    topAttractions: ['Ciudad de México', 'Chichén Itzá', 'Cancún', 'Tulum'],
    avgPrice: 'Desde 50€/noche',
    rating: 4.4,
    itinerary: ['Ciudad de México: 3 días', 'Ruta por Yucatán: 5-7 días', 'Playas: 3-5 días'],
    tips: ['Probar comida local con precaución', 'Respetar zonas arqueológicas']
  },
  {
    code: 'BRA',
    name: 'Brasil',
    image: '/images/paises/BRA.svg',
    description: 'Carnaval, playas extensas y naturaleza. Ideal para cultura y aventura.',
    bestTime: 'Primavera y verano (según región)',
    topAttractions: ['Río de Janeiro', 'Amazonas', 'Iguazú', 'Salvador'],
    avgPrice: 'Desde 55€/noche',
    rating: 4.3,
    itinerary: ['Río de Janeiro: 3-4 días', 'Iguazú: 2 días', 'Amazonas: 4-6 días'],
    tips: ['Atención a seguridad en zonas turísticas', 'Probar la gastronomía regional']
  }
]

export default destacados
