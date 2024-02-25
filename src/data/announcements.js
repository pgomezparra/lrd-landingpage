import imageOne from "@/assets/img/announcements/1.jpg";
import imageTwo from "@/assets/img/announcements/2.webp";
import scheduleImg from "@/assets/img/announcements/schedule.webp";
import activitiesImg from "@/assets/img/announcements/activities.webp";
import imageFour from "@/assets/img/announcements/4.jpg";

export const ANNOUNCEMENTS = [
  {
    image: activitiesImg,
    date: "25\nFeb",
    title: "¡Prepárate para un año lleno de emoción!",
    links: [
      {
        label: "Descarga el Cronograma",
        route:
          "https://drive.google.com/file/d/1EgzVW2qa9oaF4LwAtypmZ6APCekB9fMD/view?usp=sharing",
      },
    ],
    announcement:
      "¡Querida comunidad educativa!\n\n" +
      "Estamos emocionados de dar inicio a un nuevo año lleno de aprendizaje, crecimiento y momentos inolvidables.\n\nPara asegurarte de no perderte ninguna de las emocionantes actividades que hemos planeado, te invitamos a descargar nuestro Cronograma de Actividades del Año Escolar 2024",
  },
  {
    image: scheduleImg,
    date: "14\nFeb",
    title: "Descarga tu horario de clases y ve preparado",
    links: [
      {
        label: "Horario Primaria",
        route:
          "https://drive.google.com/file/d/14gmXG-fx7u0oSUbMLkro8Q4DNLQkY0DC/view?usp=drivesdk",
      },
      {
        label: "Horario Bachillerato",
        route:
          "https://drive.google.com/file/d/1yYB-mw3tMUwXxdsaT9ucQclBJe_YBkP8/view?usp=drivesdk",
      },
    ],
    announcement:
      "Nos complace informarles que ahora pueden acceder al horario de clases de sus hijos de una manera más conveniente y rápida.\n" +
      "\n" +
      "Aquí en nuestra página web, podrán encontrar fácilmente el horario semanal de clases de sus hijos. Esta herramienta les permitirá estar al tanto de las clases, actividades y eventos importantes para que puedan apoyar mejor el aprendizaje de sus hijos.",
  },
  {
    image: imageTwo,
    date: "14\nFeb",
    title: "Primera reunión de padres de familia 2024",
    announcement:
      "Nos complace invitarlos a nuestra primera reunión del año escolar, donde tendremos la oportunidad de compartir información importante y establecer una comunicación efectiva entre la escuela y el hogar.\n" +
      "\n" +
      "Bachillerato, cuarto y quinto grado, la reunión se llevará a cabo el día 9 de febrero a las 6:15 de la mañana. Preescolar, primero, segundo y tercer grado, la reunión se llevará a cabo el día 14 de febrero a las 6:15 de la mañana.\n" +
      "\n" +
      "Esperamos contar con su presencia para discutir temas relevantes sobre el desarrollo académico y personal de sus hijos, así como para responder cualquier pregunta que puedan tener. ¡No falten! Su participación es fundamental para el éxito de nuestros estudiantes.",
  },
  {
    image: imageFour,
    date: "28\nNov",
    title: "¡Celebremos el logro de nuestros estudiantes!",
    announcement:
      "Es un honor anunciar la ceremonia de graduación de la generación 2023 del Liceo Rey David. Un momento emocionante donde reconoceremos el esfuerzo, dedicación y éxito de nuestros estudiantes.\n" +
      "\n" +
      "Este evento no solo marca el fin de una etapa, sino el comienzo de nuevas oportunidades. Acompáñanos a aplaudir a nuestros graduados y desearles un futuro lleno de éxitos.",
  },
  {
    image: imageOne,
    date: "27\nNov",
    title: "¡Matrículas abiertas para el año escolar 2024!",
    announcement:
      "¿Buscas un colegio comprometido con la excelencia académica y el desarrollo integral de tus hijos? ¡Estás en el lugar correcto! Nos emociona anunciar que las matrículas para el próximo año están oficialmente abiertas.\n" +
      "\n" +
      "Descubre un entorno educativo estimulante, con docentes dedicados y programas innovadores. ¡Únete a nuestra comunidad escolar! Para más información y proceso de matrícula acércate a nuestras instalaciones.\n" +
      "\n" +
      "¡Te esperamos para construir juntos un futuro educativo brillante! Estaremos hasta el 7 de diciembre.",
  },
];
