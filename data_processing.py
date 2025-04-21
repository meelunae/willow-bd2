import pandas as pd
import hashlib
import csv

# Load the dataset
dataset_path = "./dataset/taylorswift-Tracks.csv"
df = pd.read_csv(dataset_path)

# Replace occurrences of "â€™" with "'"
df = df.replace({"â€™": "'"}, regex=True)

# Define album priority order (higher index = preferred edition)
album_priority = [
    "1989 (Taylor's Version) [Deluxe]", "1989 (Taylor's Version)", "1989 (Deluxe)", "1989",
    "Fearless (Taylor's Version) [Deluxe]", "Fearless (Taylor's Version)", "Fearless (Platinum Edition)", "Fearless (International Version)", "Fearless",
    "Red (Taylor's Version) [Deluxe]", "Red (Taylor's Version)", "Red (Deluxe Edition)", "Red",
    "Speak Now (Taylor's Version) [Deluxe]", "Speak Now (Taylor's Version)", "Speak Now (Deluxe Package)", "Speak Now",
    "THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY",
    "Midnights (The Til Dawn Edition)", "Midnights (3am Edition)", "Midnights",
    "evermore (deluxe version)", "evermore",
    "folklore (deluxe version)", "folklore",
    "folklore: the long pond studio sessions (from the Disney+ special) [deluxe edition]",
    "Taylor Swift (Deluxe Edition)", "Taylor Swift",
    "reputation Stadium Tour Surprise Song Playlist", "reputation",
    "Lover", "Live From Clear Channel Stripped 2008", "Speak Now World Tour Live"
]

# Assign priority values
df["album_priority"] = df["album"].apply(lambda x: album_priority.index(x) if x in album_priority else len(album_priority))

# Identify base albums while keeping Taylor's Version Deluxe separately
base_albums = {}
filtered_albums = []

for album in album_priority:
    if "Taylor's Version" in album:
        # Always include Taylor's Version albums
        filtered_albums.append(album)

        # Update base_albums only if it's not already a Deluxe version or this is a Deluxe
        base_name = album.replace(" [Deluxe]", "")
        if base_name not in base_albums or "[Deluxe]" in album:
            base_albums[base_name] = album
    else:
        base_name = album.split(" (")[0]
        if base_name not in base_albums:
            base_albums[base_name] = album
            filtered_albums.append(album)

# Remove THE TORTURED POETS DEPARTMENT (keeping only THE ANTHOLOGY)
filtered_albums = [album for album in filtered_albums if album != "THE TORTURED POETS DEPARTMENT"]
# Remove the albums containing live songs (not part of the discography)
filtered_albums = [album for album in filtered_albums if "Live" not in album]
filtered_albums = [album for album in filtered_albums if "reputation Stadium Tour Surprise Song" not in album]

# Filter dataset to only include preferred album editions
df_filtered = df[df["album"].isin(filtered_albums)].drop(columns=["album_priority"])

# Remove the annoying ID column that isn't useful at all
df_filtered = df_filtered.drop(columns=["Unnamed: 0"])

# Sort dataset by release date (newest to oldest), then by track number within each album
df_filtered = df_filtered.sort_values(by=["release_date", "track_number"], ascending=[False, True])

# Save cleaned dataset
df_filtered.to_csv("./dataset/taylorswift-Tracks-cleaned.csv", index=False)



albums = {}
for _, row in df_filtered.iterrows():
    album_name = row['album']
    release_date = row['release_date']

    album_key = f"{album_name}_{release_date}"
    album_id = hashlib.md5(album_key.encode()).hexdigest()

    if album_id not in albums:
        albums[album_id] = {
            "_id": album_id,
            "name": album_name,
            "release_date": release_date
        }

tracks = []
for _, row in df_filtered.iterrows():
    album_key = f"{row['album']}_{row['release_date']}"
    album_id = hashlib.md5(album_key.encode()).hexdigest()

    track = {
        "id": row["id"],
        "name": row["name"],
        "track_number": row["track_number"],
        "uri": row["uri"],
        "acousticness": row["acousticness"],
        "danceability": row["danceability"],
        "energy": row["energy"],
        "instrumentalness": row["instrumentalness"],
        "liveness": row["liveness"],
        "loudness": row["loudness"],
        "speechiness": row["speechiness"],
        "tempo": row["tempo"],
        "valence": row["valence"],
        "popularity": row["popularity"],
        "duration_ms": row["duration_ms"],
        "album_id": album_id
    }
    tracks.append(track)

print("Albums collection:")
print(list(albums.values())[:2])  # Preview first 2 albums
print("\nTracks collection:")
print(tracks[:2])  # Preview first 2 tracks

with open("./dataset/albums.csv", mode="w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=["_id", "name", "release_date"])
    writer.writeheader()
    writer.writerows(albums.values())
fieldnames = tracks[0].keys()

with open("./dataset/tracks.csv", mode="w", newline="") as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(tracks)
