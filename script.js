/* ============================================================================
   HANDLUNGSANWEISUNG (script.js)
   ============================================================================ */

   document.addEventListener("DOMContentLoaded", () => {

    /* --- Wellen-Box-Interaktion --- */
    const waves = document.querySelectorAll('.welle');
    const infoBox = document.getElementById('infoBox');
    const infoBoxContent = document.getElementById('infoBoxContent');
  
    waves.forEach(wave => {
      wave.addEventListener('click', (event) => {
        event.stopPropagation();
  
        infoBox.style.position = 'fixed';
        infoBox.style.left = '15%';
        infoBox.style.top = '60%';
        infoBox.style.transform = 'translateY(-50%)';

     // Bild je nach swht auswählen
  const swell = parseFloat(wave.dataset.swht || 0);
  const boardImg = swell > 1.5 
    ? "designs/girl_advancedboard.png" 
    : "designs/girl_beginnerboard.png";
  
        infoBoxContent.innerHTML = `
          <div class="box-content">
            <div class="info-text">
              <p>${wave.dataset.info}</p>
             <img src="${boardImg}"                   
              alt="Surfergirl" class="info-image">
            </div>
            
          </div>
        `;
  
        infoBox.classList.remove('hidden');
        infoBox.classList.add('visible');
      });
    });
  
    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('welle')) {
        infoBox.classList.add('hidden');
        infoBox.classList.remove('visible');
      }
    });
  
    /* --- API und Chart --- */
    const apiUrl = "https://im3.aare-jetzt.ch/unload.php";
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Abgerufene Daten:", data);
  
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("⚠️ Keine gültigen Daten erhalten – Diagramm wird nicht erstellt.");
          return;
        }
  
        console.log("Beispiel eines Datensatzes:", data[0]);
  
        // 1️⃣ Gruppiere Daten nach Bojenname
        const grouped = data.reduce((acc, entry) => {
          const name = entry.name || `Boje_${entry.bojen_id}`;
          if (!acc[name]) acc[name] = [];
          acc[name].push(entry);
          return acc;
        }, {});
  
        const firstKey = Object.keys(grouped)[0];
        if (!firstKey) {
          console.warn("⚠️ Keine Gruppen gebildet – Diagramm wird nicht erstellt.");
          return;
        }
  
        const canvas = document.getElementById("wellenChart");
        if (!canvas) {
          console.error("❌ Kein Canvas mit ID 'wellenChart' gefunden.");
          return;
        }
        const ctx = canvas.getContext("2d");
  
        // 2️⃣ Baue Datensätze für jede Boje (Swell-Höhe)
        const datasets = Object.keys(grouped).map(name => ({
          label: name,
          data: grouped[name].map(item => item.swht ?? 0),
          fill: false,
          borderColor: getRandomColor(),
          tension: 0.1,
        }));
  
        // 3️⃣ X-Achse: Zeitpunkte aus erster Boje
        const labels = grouped[firstKey].map(
          item => new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
  
        // 4️⃣ Chart initialisieren
        new Chart(ctx, {
          type: "line",
          data: { labels, datasets },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: false,
                title: { display: true, text: "Wellenhöhe (m)" },
              },
              x: {
                title: { display: true, text: "Zeit" },
              },
            },
            plugins: {
              legend: { position: 'bottom' },
            },
          },
        });
     // })//

      // --- Wellen-Icons automatisch setzen ---
      const waves = document.querySelectorAll('.welle');

      waves.forEach((wave, index) => {
        // Wir nehmen swht aus den Daten, falls index passt
        const swell = parseFloat(data[index]?.swht || 0);

        wave.dataset.swht = swell; // setzen für InfoBox-Event
        wave.src = swell > 1.5
          ? "designs/wellen/welle_gross.png" 
          : "designs/wellen/welle_klein.png";

        // Klick-Event für InfoBox
        wave.addEventListener('click', (event) => {
          event.stopPropagation();
          openInfoBox(wave);
        });
      });

    })


      .catch(error => console.error("Fetch-Fehler:", error));
  
    /* --- Hilfsfunktionen --- */
  
    function getCityColor(city) {
      const wellenFarben = {
        swht: "#09008aff",
        wwh: "#97e567ff",
      };
      return wellenFarben[city] || getRandomColor();
    }
  
    function getRandomColor() {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  });
  