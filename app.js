// --- 1. Base de Datos de Escenarios (Mantenemos la estructura) ---
const lessons = [
    {
        id: 0,
        title: "Introducción",
        key: "intro",
        theory: "¡Bienvenido a tu curso interactivo de Python! Python es un lenguaje de programación de alto nivel, interpretado y de propósito general. Es conocido por su sintaxis clara y legible, lo que lo hace perfecto para principiantes.",
        scenario: null,
        solution: null,
        hint: null // La introducción no necesita pista
    },
    {
        id: 1,
        title: "Variables",
        key: "variables",
        theory: "Una **variable** es un nombre simbólico para un valor que puede ser modificado. Piensa en ellas como cajas etiquetadas donde puedes guardar información. En Python, declaras una variable simplemente escribiendo el nombre y usando el operador de asignación (`=`).",
        scenario: "Declara una variable llamada **edad** y asígnale el valor entero **25**. Luego, imprime el valor de esa variable usando `print(edad)`.",
        solution: `
            edad = 25
            print(edad)
        `.trim(),
        hint: "Recuerda que para asignar un valor se usa el signo igual (`=`). La sintaxis debe ser `nombre_variable = valor`.", // Pista clave
        validator: (userInput) => {
            const hasAssignment = /edad\s*=\s*25/.test(userInput);
            const hasPrint = /print\s*\(\s*edad\s*\)/.test(userInput);

            if (!hasAssignment) {
                return { success: false, message: "❌ ¡Error! Debes declarar la variable 'edad' y asignarle el valor '25'." };
            }
            if (!hasPrint) {
                return { success: false, message: "❌ ¡Error! El desafío requiere que imprimas la variable 'edad' usando print(edad)." };
            }
            return { success: true, message: "✅ ¡Excelente! Has declarado e impreso tu primera variable correctamente." };
        }
    },
    {
        id: 2,
        title: "Tipos de Datos (String)",
        key: "data_types",
        theory: "Los **Strings (cadenas de texto)** se usan para almacenar texto. Se crean encerrando el texto entre comillas simples (`'`) o dobles (`\"`). Puedes unir (concatenar) strings usando el operador `+`.",
        scenario: "Declara una variable llamada **nombre** y asígnale tu nombre como un string (ej. 'Ana'). Luego, usa `print()` para concatenar y mostrar el mensaje: **'Hola, [Tu Nombre]'**.",
        solution: `
            nombre = "Carlos" 
            print("Hola, " + nombre)
        `.trim(),
        hint: "Para unir el texto 'Hola, ' con tu variable `nombre`, debes usar la función `print('Hola, ' + nombre)`.", // Pista clave
        validator: (userInput) => {
            const hasNameAssignment = /nombre\s*=\s*("|').*("|')/.test(userInput);
            const hasConcatenationPrint = /print\s*\((.*)\s*\+\s*nombre\s*\)/.test(userInput) || /print\s*\(\s*nombre\s*\+\s*(.*)\)/.test(userInput);

            if (!hasNameAssignment) {
                return { success: false, message: "❌ ¡Error! Debes declarar la variable 'nombre' y asignarle un valor de texto (string) entre comillas." };
            }
            if (!hasConcatenationPrint) {
                return { success: false, message: "❌ ¡Error! Debes concatenar el mensaje con la variable 'nombre' usando el operador `+` dentro de la función `print()`." };
            }
            return { success: true, message: "✅ ¡Genial! Has manejado strings y concatenación como un profesional." };
        }
    },
    {
        id: 3,
        title: "Condicionales (if/else)",
        key: "conditionals",
        theory: "Las sentencias **condicionales** (`if`, `elif`, `else`) permiten que el programa tome decisiones. El bloque `if` se ejecuta solo si su condición es `True`.",
        scenario: "Declara una variable `numero` con el valor **15**. Escribe una sentencia `if/else` que imprima **'Es grande'** si `numero` es **mayor que 10**, o **'Es pequeño'** en caso contrario.",
        solution: `
            numero = 15
            if numero > 10:
                print('Es grande')
            else:
                print('Es pequeño')
        `.trim(),
        hint: "La condición de tu `if` debe usar el operador mayor que (`>`). ¡No olvides los dos puntos (`:`) después de `if` y `else`!", // Pista clave
        validator: (userInput) => {
            const hasIfCondition = /if\s+numero\s*(>|>=)\s*10\s*:/is.test(userInput);
            const hasPrintLarge = /print\s*\(\s*('|")Es grande('|")\s*\)/is.test(userInput);
            const hasElse = /else\s*:/is.test(userInput);
            const hasPrintSmall = /print\s*\(\s*('|")Es pequeño('|")\s*\)/is.test(userInput);
            
            if (!hasIfCondition) {
                return { success: false, message: "❌ ¡Error! No encontré la sentencia `if numero > 10:` correctamente." };
            }
            if (!hasPrintLarge) {
                return { success: false, message: "❌ ¡Error! Asegúrate de que `print('Es grande')` esté inmediatamente después de tu condición `if`." };
            }
            if (!hasElse) {
                return { success: false, message: "❌ ¡Error! Necesitas la sentencia `else:`." };
            }
            if (!hasPrintSmall) {
                return { success: false, message: "❌ ¡Error! Asegúrate de que `print('Es pequeño')` esté inmediatamente después de tu sentencia `else`." };
            }

            return { success: true, message: "✅ ¡Perfecto! Dominas las condicionales y has programado tu primera decisión." };
        }
    }
];

// --- 2. Variables de Estado y Referencias del DOM ---
let currentLessonId = 0;

// Referencias existentes
const lessonListUl = document.getElementById('lesson-list');
const topicTitle = document.getElementById('topic-title');
const theoryText = document.getElementById('theory-text');
const scenarioText = document.getElementById('scenario-text');
const codeInput = document.getElementById('code-input');
const runButton = document.getElementById('run-button');
const nextButton = document.getElementById('next-button');
const feedbackDiv = document.getElementById('feedback');

// ¡NUEVAS REFERENCIAS para la Guía!
const helpButton = document.getElementById('help-button');
const hintContainer = document.getElementById('hint-container');


// --- 3. Funciones de Lógica de la Aplicación (Actualizadas) ---

/**
 * Carga el contenido de la lección dada en el área principal.
 * Se actualiza para manejar los elementos de Pista/Guía.
 * @param {number} id - El ID de la lección.
 */
function loadLesson(id) {
    currentLessonId = id;
    const lesson = lessons[id];

    // ... (Código de actualización de navegación omitido por brevedad) ...
    document.querySelectorAll('#lesson-list li').forEach(li => {
        li.classList.remove('active');
        if (parseInt(li.dataset.id) === id) {
            li.classList.add('active');
        }
    });

    // 1. Actualizar el Área de Contenido
    topicTitle.textContent = lesson.title;
    theoryText.innerHTML = lesson.theory;
    
    // 2. Manejo del Escenario de Práctica y la Guía
    if (lesson.scenario) {
        scenarioText.textContent = lesson.scenario;
        codeInput.value = ''; 
        codeInput.removeAttribute('readonly');
        runButton.style.display = 'inline-block';
        scenarioText.closest('.scenario-section').style.display = 'block';
        
        // **NUEVO:** Mostrar/Ocultar el botón de pista y limpiar la pista anterior
        if (lesson.hint) {
            helpButton.style.display = 'inline-block';
        } else {
            helpButton.style.display = 'none';
        }
        hintContainer.classList.add('hidden'); // Ocultar la pista al cargar la lección
        hintContainer.innerHTML = ''; // Limpiar el contenido de la pista

    } else {
        scenarioText.closest('.scenario-section').style.display = 'none';
        runButton.style.display = 'none';
        helpButton.style.display = 'none'; // También ocultamos el botón de ayuda
    }
    
    // 3. Limpiar elementos de control
    feedbackDiv.textContent = '';
    feedbackDiv.className = 'feedback';
    nextButton.classList.add('hidden');
}


/**
 * Valida el código escrito por el usuario contra la solución del escenario actual.
 */
function validateCode() {
    const lesson = lessons[currentLessonId];
    if (!lesson.validator) {
        feedbackDiv.textContent = "No hay un desafío de código para esta lección. ¡Presiona Siguiente!";
        feedbackDiv.className = 'feedback success';
        nextButton.classList.remove('hidden');
        return;
    }

    const userInput = codeInput.value.trim();
    
    // Simulación de la ejecución (limpieza de espacios y comentarios)
    const cleanInput = userInput
        .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'') 
        .replace(/#.*/g, '') 
        .replace(/\s+/g, ' ') 
        .trim();

    const validationResult = lesson.validator(cleanInput);

    // Mostrar retroalimentación
    feedbackDiv.textContent = validationResult.message;
    if (validationResult.success) {
        feedbackDiv.className = 'feedback success';
        nextButton.classList.remove('hidden');
        runButton.disabled = true; // Desactivar el botón "Ejecutar" tras el éxito
        helpButton.style.display = 'none'; // Ocultar la pista al resolver
        hintContainer.classList.add('hidden');
    } else {
        feedbackDiv.className = 'feedback error';
        nextButton.classList.add('hidden'); 
        runButton.disabled = false; // Asegurar que pueda reintentar
    }
}


/**
 * **NUEVA FUNCIÓN:** Muestra la pista de la lección actual.
 */
function showHint() {
    const lesson = lessons[currentLessonId];
    if (lesson && lesson.hint) {
        hintContainer.innerHTML = `<p>👉 **PISTA:** ${lesson.hint}</p>`;
        hintContainer.classList.remove('hidden');
    }
}


// ... (initializeLessonList y goToNextLesson se mantienen sin cambios) ...
function initializeLessonList() {
    lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.textContent = `${lesson.id + 1}. ${lesson.title}`;
        li.dataset.id = lesson.id;
        li.addEventListener('click', () => {
            loadLesson(lesson.id);
        });
        lessonListUl.appendChild(li);
    });
}

function goToNextLesson() {
    if (currentLessonId < lessons.length - 1) {
        loadLesson(currentLessonId + 1);
        window.scrollTo(0, 0); 
    }
}

// --- 4. Inicialización y Event Listeners (Actualizados) ---

document.addEventListener('DOMContentLoaded', () => {
    initializeLessonList(); 
    loadLesson(currentLessonId);
    
    runButton.addEventListener('click', validateCode);
    nextButton.addEventListener('click', goToNextLesson);

    // **NUEVO Event Listener para la ayuda**
    helpButton.addEventListener('click', showHint);
});
