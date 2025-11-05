# **Kombat Pio - Juego de Combate Multijugador**

**Kombat Pio** es un juego de combate multijugador en tiempo real, donde los jugadores se enfrentan en duelos de uno contra uno utilizando personajes con habilidades únicas. El juego se desarrolla con un sistema de turnos donde los jugadores deben gestionar su energía y seleccionar la mejor habilidad para derrotar a su oponente. El frontend está construido con **React**, **Next.js** y **CSS Modules**, mientras que la comunicación en tiempo real se maneja a través de **Socket.IO**.


---

## **Páginas del Juego**

### **Página de Inicio / Login**

La página de **login** permite a los usuarios registrados iniciar sesión en el juego mediante su correo electrónico y contraseña. Si el usuario aún no tiene una cuenta, puede acceder al formulario de **registro** para crear una nueva cuenta. El proceso de autenticación se realiza mediante una solicitud al backend, que valida los datos proporcionadas. Si los datos son correctas, el jugador es redirigido al **Menú General**. Si la validación falla, se muestra un **popup** con un mensaje de error correspondiente, indicando si los datos son incorrectas o si hubo algún problema al conectar con el servidor.

<img width="1600" height="775" alt="Inicio Sesion" src="https://github.com/user-attachments/assets/838da350-1424-4fdf-84b3-9e6c7748c02b" />

### **Página de Registro**

La página de **registro** permite a los nuevos jugadores crear una cuenta en el sistema. El formulario solicita el nombre del jugador, su correo electrónico y una contraseña. Tras completar el formulario, se realiza una validación para comprobar si el correo ya está registrado o si la contraseña cumple con los requisitos de seguridad. Si la validación es exitosa, el jugador es redirigido a la página de login. Si ocurre algún error, como un correo ya registrado o una contraseña no válida, se muestra un **popup** con el mensaje de error correspondiente, alertando al usuario del problema.

<img width="1600" height="770" alt="Registro" src="https://github.com/user-attachments/assets/87a6be5b-5219-4778-a993-104f466e8191" />


### **Menú General**

El **Menú General** es la página principal del juego a la que los jugadores acceden después de iniciar sesión. Aquí, el jugador puede ver su nombre y una bienvenida personalizada. Además, tiene acceso a varias secciones importantes del juego. Desde este menú, el jugador puede ver el **ranking** de los jugadores más exitosos, acceder a su **historial de partidas** para revisar las victorias y derrotas pasadas, y entrar a la sección **Jugar** para seleccionar su personaje y comenzar una nueva partida. También puede cerrar sesión desde esta misma página si lo desea.

<img width="1600" height="772" alt="Menu general" src="https://github.com/user-attachments/assets/651c53ed-d9f4-48e0-8d3c-57e89bad1d09" />

### **Página de Historial**

En la página de Historial, el usuario podrá consultar un registro detallado de todas las partidas que ha jugado en **Kombat Pio**. A través de esta funcionalidad, podrá ver un resumen completo de sus victorias y derrotas, proporcionando una visión general de su rendimiento en el juego. La idea es que cada partida esté acompañada de información relevante, como el personaje utilizado y el resultado del enfrentamiento.

<img width="1586" height="773" alt="historial1" src="https://github.com/user-attachments/assets/e780b04a-fea5-4122-b47b-031fb4839c41" />

<img width="1587" height="775" alt="historial" src="https://github.com/user-attachments/assets/08831726-037b-43de-9a28-a9ab63f52459" />


### **Página de Ranking**

La página de **ranking** muestra la lista de los 10 jugadores con el mejor rendimiento en el juego. El ranking se ordena según el **win rate** de cada jugador, que se calcula a partir de sus victorias y derrotas. La página permite a los jugadores ver sus estadísticas y compararlas con las de otros competidores.

<img width="1585" height="772" alt="Ranking" src="https://github.com/user-attachments/assets/43213393-5359-4f6c-b732-1baffe61e409" />

### **Tutorial**

La página de **Tutorial** cumple la función de guiar a los nuevos jugadores en sus primeros pasos dentro de **Kombat Pio**. A través de una interfaz visual e interactiva, el tutorial explica las mecánicas básicas del juego, el funcionamiento del sistema de turnos y cómo utilizar las habilidades de cada personaje de manera estratégica.  
En esta sección, el jugador aprende a reconocer los elementos principales del combate, como la **barra de salud**, la **energía disponible**, los **botones de habilidades**, entre otra cosas que aparecen durante la partida para indicar el resultado de cada acción.   

<img width="1585" height="773" alt="uto" src="https://github.com/user-attachments/assets/e9873c40-89a4-4dbc-a00e-b41023968db6" />


### **Página de Elección de Personaje**

En la página de **elección de personaje**, los jugadores seleccionan el personaje que utilizarán en su próxima batalla. Se presenta una lista de personajes disponibles, cada uno con sus características (como salud, energía y habilidades). Al hacer clic en un personaje, se abre un modal con información detallada sobre el personaje elegido. Este modal permite al jugador confirmar su selección antes de proceder a la siguiente etapa. Una vez que el jugador ha elegido su personaje, es redirigido automáticamente a la página de juego, donde podrá comenzar su combate.

<img width="1582" height="773" alt="personajes" src="https://github.com/user-attachments/assets/1fda3988-239c-4d54-81e7-9947def0aaba" />

### **Página de Juego**

La página de **juego** es el núcleo de la experiencia de combate en **Kombat Pio**. Aquí, los jugadores se enfrentan en batallas en tiempo real usando sus personajes seleccionados. El juego sigue un sistema de turnos, donde cada jugador elige una habilidad para atacar o defender. Cada acción consume energía, y el jugador debe gestionar sus recursos estratégicamente para ganar la batalla. Además, los personajes tienen una barra de salud que disminuye a medida que reciben daño. Durante el combate, se muestran notificaciones con el resultado de cada acción (como ataques exitosos, esquivas y daños). El sistema de comunicación en tiempo real permite que los jugadores vean y respondan a las acciones de su oponente de forma instantánea, creando una experiencia dinámica y competitiva. El objetivo del juego es reducir la salud del rival a cero antes de que lo haga el jugador.

<img width="1600" height="776" alt="juegosd" src="https://github.com/user-attachments/assets/4c841973-52e5-4fea-a963-85a3b34c5e52" />

<img width="1600" height="775" alt="defender" src="https://github.com/user-attachments/assets/5046292f-aaa7-49ce-85c3-4e390a00b13f" />

<img width="1600" height="775" alt="aaaaaaa" src="https://github.com/user-attachments/assets/931f7ff2-417f-4ced-916f-5b7fe8e4746c" />

---

## **Tecnologías Utilizadas**

- **Frontend**: React, Next.js, CSS Modules.

- **Backend**: Node.js, Express, Socket.IO para la comunicación en tiempo real.
  


