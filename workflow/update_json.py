
import pandas as pd
import json
import re
import requests

# Télécharger le fichier Excel depuis OneDrive
onedrive_url = "https://toulouse3.sharepoint.com/:x:/r/sites/IUTA-CRI/_layouts/15/Doc2.aspx?action=edit&sourcedoc=%7B6eb8d196-8d0b-4e81-8964-b7860d8851db%7D&wdOrigin=TEAMS-MAGLEV.undefined_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1756803475524&web=1"  # Remplace par ton lien direct
excel_filename = "Portail_TICE.xlsx"

response = requests.get(onedrive_url)
with open(excel_filename, "wb") as f:
    f.write(response.content)

# Charger le fichier Excel
df = pd.read_excel(excel_filename, sheet_name=0, engine='openpyxl')

# Fonction pour générer le nom de l'image
def generate_image_filename(title):
    simplified = re.sub(r'[^a-zA-Z0-9]', '', title.lower())
    return f"src/{simplified}.png"

# Créer les listes pour les sections users et admin
users = []
admin = []

# Traiter les plateformes utilisateurs
for _, row in df.iterrows():
    title = row.get('Plateformes - Accès utilisateurs')
    url = row.get('Lien')
    if pd.notna(title) and pd.notna(url):
        users.append({
            "title": title,
            "url": url,
            "image": generate_image_filename(title)
        })

# Traiter les plateformes admin
for _, row in df.iterrows():
    title = row.get("Plateformes dédiées à l'administration")
    url = row.get('Lien.1')
    if pd.notna(title) and pd.notna(url):
        admin.append({
            "title": title,
            "url": url,
            "image": generate_image_filename(title)
        })

# Structure finale du JSON
final_json = {
    "users": users,
    "admin": admin
}

# Sauvegarder dans un fichier JSON
with open('updated_services.json', 'w', encoding='utf-8') as f:
    json.dump(final_json, f, ensure_ascii=False, indent=4)

print("✅ Fichier updated_services.json généré avec succès.")
