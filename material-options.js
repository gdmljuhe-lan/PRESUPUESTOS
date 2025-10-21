// ==========================
// OPCIONES Y PRECIOS
// ==========================

// Barniz
const barnizOptions = {
  'LACA BRILLO': { unit: 'M2', price: 1031.00 },
  'LACA MATE': { unit: 'M2', price: 975.00 },
  'LACA HIGH GLOSS': { unit: 'M2', price: 1450.00 },
  'BARNIZ TRANSPARENTE': { unit: 'M2', price: 650.00 },
  'FONDEADO': { unit: 'M2', price: 80.00 },
  'ROYTIROL': { unit: 'M2', price: 450.00 },
  'MICROCEMENTO': { unit: 'M2', price: 1250.00 },
  'CARDEADO (MADERA MACIZA)': { unit: 'M2', price: 60.00 }
};

// Pintura
const pinturaOptions = {
  'PINTURA ELECTROSTÁTICA ECONÓMICA': { unit: 'ML/M2', price: 50.00 },
  'PINTURA ELECTROSTÁTICA MEDIA': { unit: 'ML/M2', price: 70.00 },
  'PINTURA ELECTROSTÁTICA ALTA': { unit: 'ML/M2', price: 80.00 },
  'SATINADO INOXIDABLE': { unit: 'ML/M2', price: 50.00 },
  'PULIDO ESPEJO INOXIDABLE': { unit: 'ML/M2', price: 150.00 },
  'CROMO NEGRO INOXIDABLE': { unit: 'ML/M2', price: 980.00 },
  'CROMO, NÍQUEL, LATÓN': { unit: 'ML/M2', price: 160.00 }
};

// Metal
const metalMaterialOptions = {
  'LÁMINA COLD ROLL 1/16"': { unit: 'M2', price: 350.00 },
  'LÁMINA COLD ROLL 1/8"': { unit: 'M2', price: 480.00 },
  'ACERO INOXIDABLE 1/16"': { unit: 'M2', price: 1200.00 },
  'PERFIL CUADRADO 1x1"': { unit: 'ML', price: 80.00 },
  'PERFIL REDONDO 1"': { unit: 'ML', price: 95.00 }
};

// Madera
const maderaMaterialOptions = {
  'MDF 15mm': { unit: 'M2', price: 280.00 },
  'MDF 19mm': { unit: 'M2', price: 340.00 },
  'TRIPLAY 15mm': { unit: 'M2', price: 250.00 },
  'TRIPLAY 19mm': { unit: 'M2', price: 310.00 },
  'MACIZA ENCINO': { unit: 'M2', price: 900.00 }
};

// Mármol
const marbleMaterialOptions = {
  'MÁRMOL CARRARA': { unit: 'M2', price: 1250.00 },
  'GRANITO NEGRO': { unit: 'M2', price: 1150.00 },
  'QUARZO BLANCO': { unit: 'M2', price: 1350.00 }
};

// Herrajes
const herrajeOptions = {
  'BISAGRA CIERRE SUAVE': { unit: 'PZA', price: 75.00 },
  'CORREDERA TELESCÓPICA 40cm': { unit: 'JGO', price: 180.00 },
  'JALADERA ALUMINIO 20cm': { unit: 'PZA', price: 95.00 }
};

// Eléctrico
const electricoOptions = {
  'FOCO LED 9W': { unit: 'PZA', price: 60.00 },
  'TIRA LED 5M': { unit: 'ROLLO', price: 350.00 },
  'CONTACTO DOBLE': { unit: 'PZA', price: 40.00 },
  'INTERRUPTOR SENCILLO': { unit: 'PZA', price: 35.00 }
};

// Acrílico
const acrilicoOptions = {
  'ACRÍLICO TRANSPARENTE 3mm': { unit: 'M2', price: 450.00 },
  'ACRÍLICO BLANCO LECHOSO 3mm': { unit: 'M2', price: 480.00 },
  'ACRÍLICO COLOREADO 3mm': { unit: 'M2', price: 520.00 }
};

// Espejo
const espejoOptions = {
  'ESPEJO PLATA 6mm': { unit: 'M2', price: 650.00 },
  'ESPEJO BRONCE 6mm': { unit: 'M2', price: 700.00 },
  'ESPEJO GRIS 6mm': { unit: 'M2', price: 700.00 }
};

// Vidrio
const vidrioOptions = {
  'VIDRIO CLARO 6mm': { unit: 'M2', price: 350.00 },
  'VIDRIO TEMPLADO 6mm': { unit: 'M2', price: 950.00 },
  'VIDRIO FROSTED 6mm': { unit: 'M2', price: 680.00 }
};

// Gráficos
const graficosOptions = {
  'IMPRESIÓN VINIL ADHESIVO': { unit: 'M2', price: 280.00 },
  'IMPRESIÓN LONA FRONT': { unit: 'M2', price: 250.00 },
  'IMPRESIÓN VINIL MICROPERFORADO': { unit: 'M2', price: 320.00 }
};

// Vinil
const vinilOptions = {
  'VINIL AUTOADHERIBLE BLANCO': { unit: 'M2', price: 90.00 },
  'VINIL DE CORTE': { unit: 'M2', price: 110.00 }
};

// Backlight
const backlightOptions = {
  'LONA BACKLIGHT IMPRESA': { unit: 'M2', price: 280.00 },
  'TELA BACKLIGHT IMPRESA': { unit: 'M2', price: 320.00 }
};

// Tela/Vinipiel
const telaVinipielOptions = {
  'VINIPIEL NEGRA': { unit: 'M2', price: 180.00 },
  'VINIPIEL BLANCA': { unit: 'M2', price: 200.00 },
  'VINIPIEL COLOR': { unit: 'M2', price: 210.00 }
};

// Embalaje
const embalajeOptions = {
  'CAJA CARTÓN DOBLE': { unit: 'PZA', price: 40.00 },
  'PLAYO': { unit: 'ROLLO', price: 60.00 },
  'ESPUMA PROTECTORA': { unit: 'M2', price: 25.00 }
};

// Mano de obra
const manoObraOptions = {
  'CARPINTERO': { unit: 'HORA', price: 150.00 },
  'HERRERO': { unit: 'HORA', price: 160.00 },
  'PINTOR': { unit: 'HORA', price: 140.00 },
  'INSTALADOR': { unit: 'HORA', price: 130.00 }
};

// Corte Láser
const corteLaserOptions = {
  'CORTE LÁSER ACRÍLICO 3mm': { unit: 'M2', price: 350.00 },
  'CORTE LÁSER MDF 6mm': { unit: 'M2', price: 400.00 },
  'CORTE LÁSER METAL DELGADO': { unit: 'M2', price: 800.00 }
};

// Externos
const externosOptions = {
  'TRANSPORTE LOCAL': { unit: 'SERV', price: 800.00 },
  'SUBCONTRATO': { unit: 'SERV', price: 1500.00 }
};

// Insumos
const insumosOptions = {
  'PEGAMENTO BLANCO': { unit: 'LT', price: 35.00 },
  'PEGAMENTO DE CONTACTO': { unit: 'LT', price: 70.00 },
  'TORNILLO 1"': { unit: 'BOLSA', price: 50.00 },
  'LIJA GRANO 120': { unit: 'PZA', price: 10.00 }
};

// Orden de categorías
const categoryOrder = [
  'BARNIZ', 'PINTURA', 'METAL', 'MADERA', 'MARMOL', 'HERRAJE', 'ELÉCTRICO',
  'ACRÍLICO', 'ESPEJO', 'VIDRIO', 'GRAFICOS', 'VINIL ADHERIBLE', 'BACKLIGHT',
  'TELA/VINIPIEL', 'EMBALAJE', 'MANO DE OBRA', 'CORTE LASER', 'EXTERNOS', 'INSUMOS'
];
