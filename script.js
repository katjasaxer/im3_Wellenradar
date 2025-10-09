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
  const apiUrl = "https://im3.aare-jetzt.ch/unload.php"; // Passen Sie die URL bei Bedarf an

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
  console.log("Abgerufene Daten:", data);

      const ctx = document.getElementById("wellenChart").getContext("2d");
      const datasets = Object.keys(data).map((boje) => ({
        label: city,
        data: data[boje].map((item) => item.wellen_höhe),
        fill: false,
        borderColor: getRandomColor(), // Generiert eine zufällige Farbe für jede Stadtlinie im Diagramm
        tension: 0.1, // Gibt der Linie im Diagramm eine leichte Kurve
      }));

      /* Uncomment to create the chart
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data["Bern"].map((item) => new Date(item.created_at).toLocaleDateString()), // Nimmt an, dass alle Städte Daten für dieselben Daten haben
          datasets: datasets,
        },
        options: {
          scales: {
            y: {
              beginAtZero: false, // Startet die y-Achse nicht bei 0, um einen besseren Überblick über die Schwankungen zu geben
            },
          },
        },
      });
      */
    })
    .catch((error) => console.error("Fetch-Fehler:", error)); // Gibt Fehler im Konsolenlog aus, falls die Daten nicht abgerufen werden können

  function getCityColor(city) {
    const cityColors = {
      Bern: "#ffcf33ff",
      Zürich: "#33a3ffff",
      Chur: "#2edc07ff",
      // Fügen Sie hier weitere Städte und ihre Farben hinzu
    };
    return cityColors[city] || getRandomColor(); // Gibt die vordefinierte Farbe zurück oder eine zufällige Farbe
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
