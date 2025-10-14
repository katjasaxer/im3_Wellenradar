/* ============================================================================
   HANDLUNGSANWEISUNG (script.js)
   ============================================================================ */

   document.addEventListener("DOMContentLoaded", () => {

    /* --- Wellen-Box-Interaktion --- */
    const waves = document.querySelectorAll('.welle');
    const infoBox = document.getElementById('infoBox');
    const infoBoxContent = document.getElementById('infoBoxContent');
    const inselBox = document.getElementById('insel');
  
    let chartInstance = null; // Referenz auf das aktuelle Chart
    let groupedData = {};     // globale Datenspeicherung für spätere Klicks
  
    /* --- Klick-Events für Wellen vorbereiten --- */
    waves.forEach(wave => {
      wave.addEventListener('click', (event) => {
        event.stopPropagation();
        
        infoBox.style.position = 'fixed';
        infoBox.style.left = '15%';
        infoBox.style.top = '60%';
        infoBox.style.transform = 'translateY(-50%)';
  
        // Bild je nach swht auswählen
        const swell = parseFloat(wave.dataset.swht || 0);
        const boardImg = swell > 3.5
          ? "designs/girl_advancedboard2.png"
          : "designs/girl_beginnerboard2.png"; 
  
        infoBoxContent.innerHTML = `
          <div class="box-content">
            <div class="info-text">
              <p>${wave.dataset.info}</p>
              <img src="${boardImg}" alt="Surfergirl" class="info-image">
            </div>
            <div class="chartContainer">
              <canvas id="wellenChart"></canvas>
            </div>
          </div>
        `;
  
        infoBox.classList.remove('hidden');
        infoBox.classList.add('visible');

        inselBox.classList.remove('visible');
        inselBox.classList.add('hidden');
        
  
        // 🔹 Wenn Daten schon geladen sind, Chart zeichnen
        const stationName = wave.dataset.info;
        if (groupedData[stationName]) {
          drawChartFor(stationName);
        }
      });
    });
  
    // Klick ausserhalb → Info-Box schließen + Chart löschen
    document.addEventListener('click', (e) => {
      if (!infoBox.contains(e.target)) {
        infoBox.classList.add('hidden');
        infoBox.classList.remove('visible');
        inselBox.classList.add('visible');
        inselBox.classList.remove('hidden');
        
        if (chartInstance) {
          chartInstance.destroy();
          chartInstance = null;
        }
      }

      
    });
    
    document.getElementById('closeInfoBox').addEventListener('click', () => {
    const infoBox = document.querySelector('.info-box');
    infoBox.classList.remove('visible');
    infoBox.classList.add('hidden');
    inselBox.classList.add('visible');
    inselBox.classList.remove('hidden');
    });


    /* --- API-Daten laden --- */
    const apiUrl = "https://im3.aare-jetzt.ch/unload.php";
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        //console.log("Abgerufene Daten:", data);
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ Keine gültigen Daten erhalten – Diagramm wird nicht erstellt.");
          return;
        }
  
        // Gruppiere Daten nach Bojenname
        groupedData = data.reduce((acc, entry) => {
          const name = entry.name || `Boje_${entry.bojen_id}`;
          if (!acc[name]) acc[name] = [];
          acc[name].push(entry);
          return acc;
        }, {});
  
        // console.log("Gruppierte Daten:", groupedData);
  
        // Setze Wellen-Icons anhand der Daten
        const waveNames = Object.keys(groupedData);
        waves.forEach((wave, i) => {
          const stationName = wave.dataset.info;
          const allData = groupedData[stationName] || [];
          const latest = allData[allData.length - 1];
          const swell = parseFloat(latest?.swht || 0);
  
          wave.dataset.swht = swell;
          wave.src = swell > 3.5
            ? "designs/wellen/welle_gross.png"
            : "designs/wellen/welle_klein.png";
        });
      })
      .catch(error => console.error("Fetch-Fehler:", error));
  
  
    /* --- Chart-Funktion --- */
    function drawChartFor(name) {
      const canvas = document.getElementById("wellenChart");
      if (!canvas) {
        console.error("Kein Canvas gefunden.");
        return;
      }
      const ctx = canvas.getContext("2d");
  
     // Zeitgrenze: 24 Stunden zurück
     const now = Date.now();
     const vor24h = now - 24 * 60 * 60 * 1000;

    // Daten für diesen Namen filtern
     const data = groupedData[name]?.filter(item => new Date(item.time).getTime() >= vor24h);

     if (!data || data.length === 0) {
     console.warn(`Keine Daten innerhalb der letzten 24 Stunden für ${name}`);
     return;
     }
  
      const labels = data.map(item =>
        new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
  
      const dataset = {
        label: `${name} – Wellenhöhe`,
        data: data.map(item => item.swht ?? 0),
        fill: false,
        borderColor: '#4E99D1',
        tension: 0.1,
      };
  
      // Wenn bereits ein Chart existiert, zerstören
      if (chartInstance) chartInstance.destroy();
  
      chartInstance = new Chart(ctx, {
        type: "line",
        data: { labels, datasets: [dataset] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              // <-- Hier legen wir feste Grenzen fest
              min: 0,           // Unterste Grenze
              max: 12,          // Oberste Grenze
              ticks: {
                stepSize: 2,    
              },
              title: { display: true, text: "Wellenhöhe (ft)" },
            },
            x: {
              title: { display: true, text: "Zeit (heute)" },
            },
          },
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }
  
    /* --- Hilfsfunktionen --- */
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  });
  