// ========================================
// main.js - Biobío Resiliente
// Monitor de Incendios Forestales
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // ---- ELEMENTOS DEL DOM ----
    const btnEstado = document.getElementById("btn-estado");
    const btnActualizar = document.getElementById("btn-actualizar");
    const btnMapaFocos = document.getElementById("btn-mapa-focos");
    const btnDescargarDatos = document.getElementById("btn-descargar-datos");
    const alertaBox = document.getElementById("alerta-box");
    const mapaContainer = document.getElementById("mapa-container");
    const focosInfo = document.getElementById("focos-info");
    
    const tempData = document.getElementById("temp-data");
    const humidityData = document.getElementById("humidity-data");
    const windData = document.getElementById("wind-data");
    const focosData = document.getElementById("focos-data");
    const horaActualizacion = document.getElementById("hora-30-30");

    // Variables globales para el mapa
    let mapa = null;
    let datosNASA = [];

    // ---- FUNCIONES AUXILIARES ----
    
    /**
     * Genera datos simulados en tiempo real
     * @returns {Object} Objeto con datos meteorológicos y focos
     */
    function generarDatosVivos() {
        return {
            temperatura: Math.floor(Math.random() * 15) + 20, // 20-35°C
            humedad: Math.floor(Math.random() * 40) + 15,      // 15-55%
            viento: Math.floor(Math.random() * 30) + 5,        // 5-35 km/h
            focos: Math.floor(Math.random() * 10) + 1,         // 1-10 focos
            hora: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        };
    }

    /**
     * Actualiza los datos en vivo en la página
     */
    function actualizarDatosVivos() {
        const datos = generarDatosVivos();
        
        // Animar cambios de números
        tempData.textContent = datos.temperatura;
        humidityData.textContent = datos.humedad;
        windData.textContent = datos.viento;
        focosData.textContent = datos.focos;
        horaActualizacion.textContent = datos.hora;

        // Cambiar colores según valores críticos
        if (datos.temperatura > 30 && datos.humedad < 30 && datos.viento > 30) {
            focosData.parentElement.classList.add("text-danger");
            focosData.parentElement.parentElement.classList.add("bg-danger-light");
        }
    }

    /**
     * Genera alerta basada en nivel de riesgo
     */
    function mostrarAlertaEstado() {
        alertaBox.classList.remove("d-none");
        alertaBox.innerHTML = '<div class="alert alert-info">Consultando satélite...</div>';

        setTimeout(() => {
            const nivelRiesgo = Math.random() > 0.4 ? "EXTREMO" : "ALTO";
            const colorClase = nivelRiesgo === "EXTREMO" ? "alert-danger" : "alert-warning";
            
            const mensaje = `
                <div class="alert ${colorClase} border-2 d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="alert-heading fw-bold mb-2">ALERTA FORESTAL</h4>
                        <p class="mb-0">Nivel de riesgo en el Biobío: <strong>${nivelRiesgo}</strong></p>
                        <small class="text-muted d-block mt-2">Actualizado: ${new Date().toLocaleTimeString('es-CL')}</small>
                    </div>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Cerrar alerta"></button>
                </div>
            `;

            alertaBox.innerHTML = mensaje;

        }, 1500);
    }

    /**
     * Genera focos de incendio simulados en la región de Biobío
     * @returns {Array} Array de focos con lat, lon, intensidad
     */
    function generarFocosSimulados() {
        const centro = { lat: -37.5, lon: -72.5 }; // Centro de Biobío
        const focos = [];
        const cantidad = Math.floor(Math.random() * 8) + 3; // 3-10 focos

        for (let i = 0; i < cantidad; i++) {
            focos.push({
                lat: centro.lat + (Math.random() - 0.5) * 1.5,
                lon: centro.lon + (Math.random() - 0.5) * 1.5,
                intensidad: Math.floor(Math.random() * 100) + 20, // 20-120 MW
                fecha: new Date().toLocaleDateString('es-CL'),
                confianza: Math.floor(Math.random() * 40) + 60 // 60-100%
            });
        }
        return focos;
    }

    /**
     * Obtiene datos de NASA FIRMS o simula si falla
     */
    async function obtenerFocosFIRMS() {
        try {
            // Intenta obtener datos reales de NASA FIRMS
            // Nota: Esto requiere API key, así que usamos simulación
            console.log("Generando datos de focos simulados...");
            datosNASA = generarFocosSimulados();
            return datosNASA;
        } catch (error) {
            console.warn("Error al obtener datos NASA FIRMS, usando simulación:", error);
            datosNASA = generarFocosSimulados();
            return datosNASA;
        }
    }

    /**
     * Inicializa y muestra el mapa interactivo con Leaflet
     */
    async function inicializarMapa() {
        // Obtener datos
        const focos = await obtenerFocosFIRMS();

        // Limpiar contenedor
        mapaContainer.innerHTML = '';

        // Crear mapa
        const elementoMapa = document.createElement('div');
        elementoMapa.id = 'map-leaflet';
        elementoMapa.style.width = '100%';
        elementoMapa.style.height = '100%';
        mapaContainer.appendChild(elementoMapa);

        // Centro en Biobío
        const centro = [-37.5, -72.5];
        
        mapa = L.map('map-leaflet').setView(centro, 9);

        // Capa base OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(mapa);

        // Agregar marcadores de focos
        focos.forEach((foco, idx) => {
            const intensidad = foco.intensidad;
            const color = intensidad > 80 ? '#d90429' : intensidad > 50 ? '#ff6b35' : '#ffb703';
            
            const marker = L.circleMarker([foco.lat, foco.lon], {
                radius: Math.sqrt(intensidad) / 2,
                fillColor: color,
                color: 'darkred',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.7
            }).addTo(mapa);

            // Popup con información
            const popup = `
                <div style="font-size: 0.9rem;">
                    <strong>Foco #${idx + 1}</strong><br>
                    Intensidad: ${intensidad} MW<br>
                    Confianza: ${foco.confianza}%<br>
                    Fecha: ${foco.fecha}
                </div>
            `;
            marker.bindPopup(popup);

            // Información al pasar mouse
            marker.on('mouseover', function() {
                this.openPopup();
            });
        });

        // Actualizar información de focos
        focosInfo.innerHTML = `
            <div class="alert alert-info mb-0">
                <strong>Focos detectados: ${focos.length}</strong><br>
                <small>Región: Biobío | Actualización: ${new Date().toLocaleTimeString('es-CL')}</small>
            </div>
        `;

        // Auto-ajustar vista al contenido
        if (focos.length > 0) {
            const bounds = L.latLngBounds(focos.map(f => [f.lat, f.lon]));
            mapa.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    /**
     * Descarga datos de focos en formato CSV
     */
    function descargarDatosCSV() {
        if (datosNASA.length === 0) {
            alert('No hay datos para descargar');
            return;
        }

        // Crear CSV
        let csv = 'Latitud,Longitud,Intensidad (MW),Confianza (%),Fecha\n';
        datosNASA.forEach(foco => {
            csv += `${foco.lat.toFixed(4)},${foco.lon.toFixed(4)},${foco.intensidad},${foco.confianza},"${foco.fecha}"\n`;
        });

        // Descargar
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const enlace = document.createElement('a');
        const url = URL.createObjectURL(blob);
        enlace.setAttribute('href', url);
        enlace.setAttribute('download', `focos-biobio-${new Date().toISOString().split('T')[0]}.csv`);
        enlace.style.visibility = 'hidden';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    }

    // ---- EVENT LISTENERS ----

    /**
     * Evento: Botón "Ver Estado Actual"
     */
    if (btnEstado) {
        btnEstado.addEventListener("click", () => {
            mostrarAlertaEstado();
        });
    }

    /**
     * Evento: Botón "Actualizar Ahora"
     */
    if (btnActualizar) {
        btnActualizar.addEventListener("click", () => {
            btnActualizar.disabled = true;
            btnActualizar.innerHTML = 'Actualizando...';
            
            setTimeout(() => {
                actualizarDatosVivos();
                btnActualizar.disabled = false;
                btnActualizar.innerHTML = 'Actualizar Ahora';
            }, 800);
        });
    }

    /**
     * Evento: Botón "Ver Mapa"
     */
    if (btnMapaFocos) {
        btnMapaFocos.addEventListener("click", async () => {
            btnMapaFocos.disabled = true;
            btnMapaFocos.innerHTML = 'Cargando...';
            
            // Abrir modal
            const modal = new bootstrap.Modal(document.getElementById('modalMapaFocos'));
            modal.show();

            // Inicializar mapa cuando se abra el modal
            setTimeout(async () => {
                await inicializarMapa();
                btnMapaFocos.disabled = false;
                btnMapaFocos.innerHTML = 'Ver Mapa';
            }, 300);
        });
    }

    /**
     * Evento: Botón "Descargar Datos"
     */
    if (btnDescargarDatos) {
        btnDescargarDatos.addEventListener("click", descargarDatosCSV);
    }

    // ---- INICIALIZACIÓN ----
    actualizarDatosVivos();

    // Auto-actualizar cada 30 segundos
    setInterval(() => {
        actualizarDatosVivos();
    }, 30000);

    // ---- SCROLLING SUAVE ----
    document.querySelectorAll('a[href^="#"]').forEach(enlace => {
        enlace.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#") {
                e.preventDefault();
                return;
            }
            
            const destino = document.querySelector(href);
            if (destino) {
                e.preventDefault();
                destino.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

});