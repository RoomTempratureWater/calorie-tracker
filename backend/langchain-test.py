from dotenv import load_dotenv, dotenv_values
from urllib.parse import quote_plus


config = dotenv_values(".env") #SUPABASE_URL, SUPABASE_KEY, HF_API

password = quote_plus(config['POSTGRES_PASS'])
host = config['POSTGRES_HOST']
pg_url = f"postgresql://postgres:{password}@{host}:5432/postgresi"

print(pg_url)

print("hello world")
print(config['HF_API'])







