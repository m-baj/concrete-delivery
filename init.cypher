// Dodanie kuriera
CREATE (c1:Courier {courierID: 1, name: 'Adam'})

// Dodanie lokalizacji w Warszawie
CREATE (l1:Location {locationID: 1, address: 'ul. Marszałkowska 10, Warszawa', coordinates: point({latitude: 52.2297, longitude: 21.0122}), orderID: 101})
CREATE (l2:Location {locationID: 2, address: 'ul. Tadeusza Czackiego 21, Warszawa', coordinates: point({latitude: 52.2385, longitude: 21.0144}), orderID: 102})
CREATE (l3:Location {locationID: 3, address: 'ul. Marszałkowska 104, Warszawa', coordinates: point({latitude: 52.2333, longitude: 21.0102}), orderID: 103})
CREATE (l4:Location {locationID: 4, address: 'ul. Marszałkowska 99A, Warszawa', coordinates: point({latitude: 52.2294, longitude: 21.0107}), orderID: 104})

// Relacje między kurierem a lokalizacjami
CREATE (c1)-[:IS_AT]->(l1)
CREATE (c1)-[:DELIVERS_TO]->(l2)
CREATE (l2)-[:THEN]->(l3)
CREATE (l3)-[:THEN]->(l4)
