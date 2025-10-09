<?php

/* ============================================================================
   HANDLUNGSANWEISUNG (extract.php)
   1) Lade Konfiguration/Constants (API-URL, Parameter, ggf. Zeitzone).
   2) Baue die Request-URL (Query-Params sauber via http_build_query).
   3) Initialisiere cURL (curl_init) mit der Ziel-URL.
   4) Setze cURL-Optionen (RETURNTRANSFER, TIMEOUT, HTTP-Header, FOLLOWLOCATION).
   5) Führe Request aus (curl_exec) und prüfe Transportfehler (curl_error).
   6) Prüfe HTTP-Status & Content-Type (JSON erwartet), sonst früh abbrechen.
   7) Dekodiere JSON robust (json_decode(..., true)).
   8) Normalisiere/prüfe Felder (defensive Defaults, Typen casten).
   9) Gib die Rohdaten als PHP-Array ZURÜCK (kein echo) für den Transform-Schritt.
  10) Fehlerfälle: Exception/Fehlerobjekt nach oben reichen (kein HTML ausgeben).
   ============================================================================ */

function fetchBuoyData($bId)
{
    $url = "https://surftruths.com/api/buoys/$bId/readings.json";

    // Initialisiert eine cURL-Sitzung
    $ch = curl_init($url);  //$ch ist variablenname von wolfgang & nick

    // Setzt Optionen
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Führt die cURL-Sitzung aus und erhält den Inhalt
    $response = curl_exec($ch);

    // Schließt die cURL-Sitzung
    curl_close($ch);
    //print_r($response);

    // Dekodiert die JSON-Antwort und gibt Daten zurück
    return json_decode($response, true);
}

$locationsMap = [
    '46014' => 'Albion',
    '46237' => 'San Francisco Bar',
    '46215' => 'Diablo Canyon',
    '46268' => 'Topanga',
    '46235' => 'Imperial Beach',
];

$bdata = [];

forEach($locationsMap as $bId => $bName){
    $einzelneboje = fetchBuoyData($bId)[0];
    $einzelneboje["id"] = $bId;
    $einzelneboje["name"] = $bName;
   
    $bdata[] = $einzelneboje;

} 
// Gibt die Daten zurück,
return $bdata;

?>

