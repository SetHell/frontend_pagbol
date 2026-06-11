export type GuiaItem = {
  num: string;
  texto: string;
};

export type GuiaArticulo = {
  art: string;
  titulo: string;
  items: GuiaItem[];
};

export const guiaArticulos: GuiaArticulo[] = [
  {
    art: "ART. 380",
    titulo: "INFRACCIONES DE PRIMER GRADO.",
    items: [
      {
        num: "4)",
        texto: "Por conducir vehículos sin tener licencia ni autorización.",
      },
      {
        num: "5)",
        texto:
          "Por confiar o permitir la conducción de su vehículo a persona que no tenga licencia.",
      },
      {
        num: "14)",
        texto: "Por circular con exceso de velocidad.",
      },
      {
        num: "16)",
        texto: "Por circular en contra ruta señalizada.",
      },
      {
        num: "17)",
        texto: "Por estacionar o detener su vehículo en la carretera.",
      },
      {
        num: "38)",
        texto:
          "Por no ceder injustificadamente el paso a los vehículos de la Policía, Bomberos y Ambulancias.",
      },
      {
        num: "39)",
        texto:
          "Por no ceder el paso al vehículo del Señor Presidente del Estado Plurinacional de Bolivia.",
      },
      {
        num: "40)",
        texto: "Por estacionar en lugares prohibidos.",
      },
    ],
  },
  {
    art: "ART. 381",
    titulo: "INFRACCIONES DE SEGUNDO GRADO.",
    items: [
      {
        num: "1)",
        texto:
          "Por viajar sin equipo, herramientas, señales de emergencia e implementos de auxilio.",
      },
      {
        num: "7)",
        texto:
          "Por negarse a exhibir licencia ante la autoridad de Tránsito.",
      },
      {
        num: "9)",
        texto: "Por no observar las señales de Tránsito.",
      },
      {
        num: "14)",
        texto: "Por no presentarse a las inspecciones de Tránsito.",
      },
      {
        num: "43)",
        texto: "Por distraerse peligrosamente al conducir un vehículo.",
      },
      {
        num: "44)",
        texto:
          "Por proseguir la marcha del vehículo cuando el semáforo señala la luz roja.",
      },
    ],
  },
  {
    art: "ART. 382",
    titulo: "INFRACCIONES DE TERCER GRADO.",
    items: [
      {
        num: "1)",
        texto: "Por negarse sin causal justificada a llevar pasajeros.",
      },
      {
        num: "4)",
        texto: "Por estacionar incorrectamente en vías urbanas.",
      },
      {
        num: "7)",
        texto: "Por usar la bocina en forma indebida.",
      },
      {
        num: "20)",
        texto:
          "Por efectuar virajes en “U” en las intersecciones de las calles y caminos.",
      },
      {
        num: "21)",
        texto: "Por no conservar su derecha al conducir un vehículo.",
      },
      {
        num: "22)",
        texto:
          "Por no dar preferencia al vehículo que circula por una avenida preferencial.",
      },
    ],
  },
];