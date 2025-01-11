# PZSP2-Betoniarze-Kurierzy


## Mentor zespołu: dr hab. Wojciech Mazurczyk

## Właściciel tematu: dr inż. Tomasz Śliwiński


### Cel projektu
Celem naszego projektu jest stworzenie aplikacji, która będzie zarządzała pracą firmy kurierskiej specjalizującej się w przewozie kompaktowych paczek, na ograniczonym obszarze. Nasz system umożliwi zgłaszanie przesyłek oraz będzie je optymalnie przydzielał pomiędzy dostępnych kurierów, żeby jak najbardziej minimalizować koszty transportu.

### Wstępna wizja projektu
Projekt zostanie zrealizowany z podziałem na frontend i backend. Pierwszy z nich będzie implementowany jako aplikacja webowa przy użyciu frameworku React, a backend, stworzony przy użyciu biblioteki FastAPI oraz bazy danych PostgreSQL. Dodatkowo planujemy wykorzystać API OpenStreetMap oraz VROOM (Vehicle Routing Open-source Optimization Machine), aby zoptymalizować trasy dostaw kurierów.

### Uruchamianie aplikacji
Ponieważ w projekcie została wykorzystana konteneryzacja, proces budowy systemu sprowadza się do:
1. Pobrania kodu z repozytorium
```bash
git clone https://gitlab-stud.elka.pw.edu.pl/kkrol1/pzsp2-betoniarze-kurierzy.git
```
2. Zbudowania obrazów i uruchomienia kontenerów poleceniem: 
```bash
docker-compose up --build 
```
Po około dwóch minutach wszystkie usługi w kontenerach będą gotowe.
Frontend będzie dostępny pod adresem: http://localhost:3000/
Aby zatrzymać działanie kontenerów należy użyć polecenia:
```bash
docker-compose down
```

### Uruchamianie testów
Aby uruchomić testy należy wykonać poniższe kroki:
1. Należy przejść do głównego katalogu projektu.
2. Następnie uruchomić kontenery dockera za pomocą komendy:
```bash
docker-compose up --build
```
3. Testy można uruchomić na dwa sposoby:

3.1 bez raportu o pokryciu kodu:
W nowym terminalu należy wprowadzić komendę:
```bash
docker exec -it backend pytest
```
3.2 z raportem o pokryciu kodu:
Wygenerowanie raportu
```bash
docker exec -it backend coverage run --source=app --omit="/tests/,*/test_*.py" -m pytest
```
Wygenerowanie pliku html na podstawie raportu:
```bash
docker exec -it backend coverage report
```
Raport wygeneruje się wewnątrz kontenera, więc należy skopiować go na własny komputer:
```bash
docker cp backend:/app/htmlcov ./htmlcov
```
4. W terminalu zostanie wygenerowany krótki raport z testów.
5. Po zakończeniu testów należy zamknąć kontener backend za pomocą komendy:
```bash
docker-compose down
```