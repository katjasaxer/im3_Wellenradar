# im3_Wellenradar

•⁠  ⁠mobile board-infobox: zu gross, noch scrollbar
•⁠  ⁠⁠mobile insel mit surfergirl und boards: zu klein, hover zu wenig
•⁠  ⁠⁠mobile: inhaltsbox: pfeil zu gross, box nicht zentriert auf
   mobileseite
•⁠  ⁠⁠mobile: wellenicons bewegen sich mit bis 690px, alles grösser ist
   gut, wenn mehr mobile icons nicht fix
•⁠  ⁠⁠mobile: wenn weisse boxen auf, dann verschiebt es boards im
   hintergrund
•⁠  ⁠⁠schönere transition wenn neue daten laden zwischen orten, jetzt zu
   ruckelig
•⁠  ⁠⁠desktop: insel mit surfergirl und boards sieht man, wenn weisse
   boxen offen   

Kurzbeschreibung
   Auf unserer Webseite lassen sich Wellenhöhe und Wellenrichtung der letzten 24 Stunden in ganz Kalifornien abrufen. Zwei Farben zeigen das passende Surflevel an: Blau für Beginner und Orange für Advanced. Klickt man auf ein Wellen-Icon, erscheint eine Übersicht mit einer Grafik zur Wellenhöhe, einer Level-Empfehlung sowie einem Kompass, der die aktuelle Wellenrichtung anzeigt (z. B. NNO – Nordnordost). Genauere Informationen zu den Surflevels erhält man über die Boards neben der Surferin auf der Insel, etwa dass das Advanced-Level ab einer Wellenhöhe von 5 ft beginnt. 

Learnings
   •	kontinuierlich Daten aus APIs abgreifen und in über PHP in einer eigenen Datenbank zu speichern.
   •	Mit Extract Daten aus der API holen
   •	Mit Transform die Daten weiterverarbeiten
   •	Mit Load die Daten in eine Datenbank transformieren.

Schwierigkeiten
   •	Anzeige der Daten nur der letzen 24h und nicht alle gesammelten Daten
   •	Das je nach Wellenhöhe zwei unterschiedliche Wellenicons angezeigt werden
   •	Infobox im mobile nie ganz in der Mitte

Benutze Ressourcen
   ChatGPT Prompts:
   •	wie kann ich mit einem event.target alle elemente in einem div abfangen respektive bei einem klick prüfen ob ein element in einem bestimmten div mit id ist?
   •	wir haben diesen code in js und möchten dass die icons der welle klein auf den icon welle gross wechselt, wenn der wert son swht über 1.5 ist. aktueller js code:
   •	wie können wir im java script so prgrammieren, dass die box immer in der linken hälfte am gleichen ort kommt und nicht links vom icon
