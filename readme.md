# **Kombat Pio - Juego de Combate Multijugador**

**Kombat Pio** es un juego de combate multijugador en tiempo real, donde los jugadores se enfrentan en duelos de uno contra uno utilizando personajes con habilidades únicas. El juego se desarrolla con un sistema de turnos donde los jugadores deben gestionar su energía y seleccionar la mejor habilidad para derrotar a su oponente. El frontend está construido con **React**, **Next.js** y **CSS Modules**, mientras que la comunicación en tiempo real se maneja a través de **Socket.IO**.

---

## **Páginas del Juego**

### **Página de Inicio / Login**

La página de **login** permite a los usuarios registrados iniciar sesión en el juego mediante su correo electrónico y contraseña. Si el usuario aún no tiene una cuenta, puede acceder al formulario de **registro** para crear una nueva cuenta. El proceso de autenticación se realiza mediante una solicitud al backend, que valida los datos proporcionadas. Si los datos son correctas, el jugador es redirigido al **Menú General**. Si la validación falla, se muestra un **popup** con un mensaje de error correspondiente, indicando si los datos son incorrectas o si hubo algún problema al conectar con el servidor.

### **Página de Registro**

La página de **registro** permite a los nuevos jugadores crear una cuenta en el sistema. El formulario solicita el nombre del jugador, su correo electrónico y una contraseña. Tras completar el formulario, se realiza una validación para comprobar si el correo ya está registrado o si la contraseña cumple con los requisitos de seguridad. Si la validación es exitosa, el jugador es redirigido a la página de login. Si ocurre algún error, como un correo ya registrado o una contraseña no válida, se muestra un **popup** con el mensaje de error correspondiente, alertando al usuario del problema.

### **Página de Historial**

En la página de Historial, el usuario podrá consultar un registro detallado de todas las partidas que ha jugado en **Kombat Pio**. A través de esta funcionalidad, podrá ver un resumen completo de sus victorias y derrotas, proporcionando una visión general de su rendimiento en el juego. La idea es que cada partida esté acompañada de información relevante, como el personaje utilizado y el resultado del enfrentamiento.

### **Menú General**

El **Menú General** es la página principal del juego a la que los jugadores acceden después de iniciar sesión. Aquí, el jugador puede ver su nombre y una bienvenida personalizada. Además, tiene acceso a varias secciones importantes del juego. Desde este menú, el jugador puede ver el **ranking** de los jugadores más exitosos, acceder a su **historial de partidas** para revisar las victorias y derrotas pasadas, y entrar a la sección **Jugar** para seleccionar su personaje y comenzar una nueva partida. También puede cerrar sesión desde esta misma página si lo desea.

### **Página de Elección de Personaje**

En la página de **elección de personaje**, los jugadores seleccionan el personaje que utilizarán en su próxima batalla. Se presenta una lista de personajes disponibles, cada uno con sus características (como salud, energía y habilidades). Al hacer clic en un personaje, se abre un modal con información detallada sobre el personaje elegido. Este modal permite al jugador confirmar su selección antes de proceder a la siguiente etapa. Una vez que el jugador ha elegido su personaje, es redirigido automáticamente a la página de juego, donde podrá comenzar su combate.

### **Página de Juego**

La página de **juego** es el núcleo de la experiencia de combate en **Kombat Pio**. Aquí, los jugadores se enfrentan en batallas en tiempo real usando sus personajes seleccionados. El juego sigue un sistema de turnos, donde cada jugador elige una habilidad para atacar o defender. Cada acción consume energía, y el jugador debe gestionar sus recursos estratégicamente para ganar la batalla. Además, los personajes tienen una barra de salud que disminuye a medida que reciben daño. Durante el combate, se muestran notificaciones con el resultado de cada acción (como ataques exitosos, esquivas y daños). El sistema de comunicación en tiempo real permite que los jugadores vean y respondan a las acciones de su oponente de forma instantánea, creando una experiencia dinámica y competitiva. El objetivo del juego es reducir la salud del rival a cero antes de que lo haga el jugador.

### **Página de Ranking**

La página de **ranking** muestra la lista de los 10 jugadores con el mejor rendimiento en el juego. El ranking se ordena según el **win rate** de cada jugador, que se calcula a partir de sus victorias y derrotas. La página permite a los jugadores ver sus estadísticas y compararlas con las de otros competidores. 

### **Página de Historial de Partidas**

En la página de **historial de partidas**, los jugadores pueden ver un registro completo de sus enfrentamientos previos. Cada partida muestra detalles como el oponente, el resultado (victoria o derrota) y las estadísticas clave de la batalla. Esta página ofrece una visión general del progreso del jugador, permitiéndole analizar sus estrategias y aprender de sus enfrentamientos anteriores.

### **Descripción de los Componentes**

La aplicación está compuesta por varios elementos diseñados para ofrecer una experiencia de usuario fluida e interactiva. Cada parte de la interfaz facilita la interacción, desde la selección de personajes hasta las acciones en combate.
Los componentes visuales muestran en tiempo real las estadísticas del personaje, como salud y energía, y las habilidades disponibles. Estos elementos permiten al jugador tomar decisiones informadas durante el juego.
La dinámica de combate está organizada en menús fáciles de usar, que guían al jugador en cada fase del turno, ya sea atacando, defendiendo o esperando al rival.
La aplicación también incluye formularios para el inicio de sesión y la selección de personajes, facilitando el acceso y la personalización del perfil de usuario. La interfaz está diseñada para ser clara y atractiva, permitiendo que el jugador se concentre en la acción sin distracciones. Todos los elementos responden rápidamente para mantener el flujo del juego sin interrupciones.


---

## **Tecnologías Utilizadas**

- **Frontend**: React, Next.js, CSS Modules.
- **Backend**: Node.js, Express, Socket.IO para la comunicación en tiempo real.

