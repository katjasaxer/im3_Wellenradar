/* ============================================================================
   HANDLUNGSANWEISUNG (script.js)
   1) Warte auf DOMContentLoaded, bevor du DOM referenzierst.
   2) Setze apiUrl auf den korrekten Backend-Endpoint (unload.php o. ä.).
   3) Hole Daten asynchron (fetch), prüfe response.ok, parse JSON.
   4) Transformiere Daten für das Chart: labels, datasets je Stadt/Serie bilden.
   5) Initialisiere Chart.js mit Typ (line), data (labels, datasets), options (scales).
   6) Nutze Hilfsfunktionen (z. B. getRandomColor) für visuelle Unterscheidung.
   7) Behandle Fehler (catch) → logge aussagekräftig, zeige Fallback im UI.
   8) Optional: Datum/Uhrzeit schön formatieren (toLocaleDateString/Time).
   9) Performance: große Responses paginieren/filtern; Redraws minimieren.
  10) Sicherheit: Keine geheimen Keys im Frontend; nur öffentliche Endpunkte nutzen.
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const waves = document.querySelectorAll('.welle');
  const infoBox = document.getElementById('infoBox');

  waves.forEach(wave => {
    wave.addEventListener('click', (event) => {
      event.stopPropagation(); // verhindert, dass das Dokument den Klick abfängt

      // Position der Info-Box (immer fix links am Bildschirm)
      infoBox.style.position = 'fixed';
      infoBox.style.left = '250px'; // Abstand vom linken Bildschirmrand
      infoBox.style.top = '420px';   // mittig im Bildschirm
      infoBox.style.transform = 'translateY(-50%)';

      // Inhalt der Box (später dynamisch befüllbar)
      infoBox.innerHTML = `
        <div class="box-content">
            <div class="info-text">
            <h3>${wave.dataset.info}</h3>
          <img src="designs/boards/girl_beginnerboard.png" alt="Surfergirl" class="info-image" >
          </div>
        </div>
      `;

      // Box sichtbar machen
      infoBox.classList.remove('hidden');
      infoBox.classList.add('visible');
    });
  });

  // Klick außerhalb der Wellen → Info-Box schließen
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('welle')) {
      infoBox.classList.add('hidden');
      infoBox.classList.remove('visible');
    }
  });

  //API und Chart

  const apiUrl = "https://im3.aare-jetzt.ch/unload.php"; // Passen Sie die URL bei Bedarf an

  fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log("Abgerufene Daten:", data);

    if (!Array.isArray(data)) {
      console.error("❌ Erwartetes Array, aber erhalten:", typeof data, data);
      return;
    }
    
    if (data.length === 0) {
      console.warn("⚠️ Keine Daten erhalten vom Backend.");
      return;
    }
    
    console.log("Beispiel eines Datensatzes:", data[0]);

    // 1️⃣ Group data by buoy name
    const grouped = data.reduce((acc, entry) => {
      const name = entry.name;
      if (!acc[name]) acc[name] = [];
      acc[name].push(entry);
      return acc;
    }, {});

    // 2️⃣ Get context for Chart.js
    const ctx = document.getElementById("wellenChart").getContext("2d");

    // 3️⃣ Build datasets for each buoy
    const datasets = Object.keys(grouped).map(name => ({
      label: name,
      data: grouped[name].map(item => item.swht), // or item.wwh, whichever you want
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    }));

    // 4️⃣ Labels (x-axis) — use times from the first buoy
    const labels = grouped[Object.keys(grouped)[0]].map(
      item => new Date(item.time).toLocaleTimeString()
    );

    // 5️⃣ Create chart
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  })
  .catch(error => console.error("Fetch-Fehler:", error));


  function getCityColor(city) {
    const wellenFarben = {
      swht: "#09008aff",
      wwh: "#97e567ff",
  
      // Fügen Sie hier weitere Städte und ihre Farben hinzu
    };
    return wellenFarben[boje] || getRandomColor(); // Gibt die vordefinierte Farbe zurück oder eine zufällige Farbe
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color; // Erzeugt eine zufällige Farbe
  }
});

