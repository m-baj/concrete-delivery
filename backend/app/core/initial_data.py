from sqlmodel import Session
from app.models import User
from datetime import date
from app.core.config import settings
from app.models import Address, Courier, Status
from app.core.security import get_password_hash


def load_initial_data(session: Session):
    # Sprawdzenie, czy dane już istnieją
    if session.query(Address).first() or session.query(Status).first() or session.query(Courier).first() or session.query(User).first():
        print("Dane początkowe są już załadowane.")
        return

    print("Ładowanie danych początkowych...")

    # Dodanie adresów
    addresses = [
        Address(
            city="Warszawa",
            postal_code="00-001",
            street="Marszałkowska",
            house_number="10",
            apartment_number="5",
            X_coordinate=52.2297,
            Y_coordinate=21.0122
        ),
        Address(
            city="Warszawa",
            postal_code="00-002",
            street="Krucza",
            house_number="20",
            apartment_number="8",
            X_coordinate=52.2291,
            Y_coordinate=21.0125
        ),
    ]
    session.add_all(addresses)
    session.commit()
    print("Adresy zostały załadowane.")

    # Pobranie adresów
    marszalkowska = session.query(Address).filter_by(street="Marszałkowska").first()
    krucza = session.query(Address).filter_by(street="Krucza").first()

    # Dodanie statusów
    statuses = [
        Status(name="Order Accepted"),        # Zlecenie przyjęte
        Status(name="Package Picked Up"),     # Paczka odebrana od nadawcy
        Status(name="Package Delivered"),     # Paczka dostarczona
        Status(name="Available"),             # Dostępny
        Status(name="Unavailable"),           # Niedostępny
        Status(name="On Delivery"),           # W trakcie dostawy
    ]
    session.add_all(statuses)
    session.commit()
    print("Statusy zostały załadowane.")

    # Dodanie użytkowników dla kurierów
    couriers_users = [
        User(
            name="Jan",
            surname="Kowalski",
            phone_number="500600700",
            email_address="jan.kowalski@example.com",
            hashed_password=get_password_hash("kurier"),
            account_type="COURIER"
        ),
        User(
            name="Anna",
            surname="Nowak",
            phone_number="600700800",
            email_address="anna.nowak@example.com",
            hashed_password=get_password_hash("kurier"),
            account_type="COURIER"
        ),
    ]
    session.add_all(couriers_users)
    session.commit()
    print("Użytkownicy dla kurierów zostali załadowani.")

    # Pobranie użytkowników kurierów
    jan_user = session.query(User).filter_by(phone_number="500600700").first()
    anna_user = session.query(User).filter_by(phone_number="600700800").first()
    available_status = session.query(Status).filter_by(name="Available").first()

    # Dodanie kurierów do tabeli `Courier`
    couriers = [
        Courier(
            name=jan_user.name,
            surname=jan_user.surname,
            phone_number=jan_user.phone_number,
            home_address_id=marszalkowska.id,
            status_id=available_status.id
        ),
        Courier(
            name=anna_user.name,
            surname=anna_user.surname,
            phone_number=anna_user.phone_number,
            home_address_id=krucza.id,
            status_id=available_status.id
        ),
    ]
    session.add_all(couriers)
    session.commit()
    print("Kurierzy zostali załadowani.")

    # Dodanie użytkownika końcowego
    user = User(
        name="Piotr",
        surname="Zieliński",
        phone_number="700800900",
        email_address="piotr.zielinski@example.com",
        hashed_password=get_password_hash("user"),
        account_type="USER",
    )

    # Pobranie kurierów z tabeli Courier
    jan_courier = session.query(Courier).filter_by(phone_number="500600700").first()
    anna_courier = session.query(Courier).filter_by(phone_number="600700800").first()

    # Aktualizacja kolumny courier_id w tabeli User
    jan_user.courier_id = jan_courier.id
    anna_user.courier_id = anna_courier.id

    # Zapisanie zmian w sesji
    session.add(jan_user)
    session.add(anna_user)
    session.add(user)
    session.commit()
    print("Użytkownik końcowy został załadowany.")
