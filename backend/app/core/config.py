import secrets
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic_core import MultiHostUrl
from pydantic import PostgresDsn, computed_field
from neontology import Database

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../env",
    )
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    PROJECT_NAME: str
    POSTGRES_SERVER: str = "postgres"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    NEO4J_URL: str = "bolt://localhost:7687"
    NEO4J_AUTH: str = "neo4j/password"

    SUPERUSER_PHONE_NUMBER: str = "000000000"
    SUPERUSER_EMAIL_ADDRESS: str = "superuser@test.com"
    SUPERUSER_PASSWORD: str

    @computed_field
    @property
    def DATABASE_URL(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=f"/{self.POSTGRES_DB}",
        )

    @computed_field
    @property
    def NEO4J_USER(self) -> str:
        return self.NEO4J_AUTH.split("/")[0]

    @computed_field
    @property
    def NEO4J_PASSWORD(self) -> str:
        return self.NEO4J_AUTH.split("/")[1]

    def get_database(self) -> Database:
        return Database(self.NEO4J_URL, self.NEO4J_USER, self.NEO4J_PASSWORD)


# Instantiate settings and initialize the database
settings = Settings()
database = settings.get_database()
