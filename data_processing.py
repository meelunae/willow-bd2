import pandas as pd

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
        base_name = album.replace(" [Deluxe]", "")  # Prefer Deluxe if available
        if base_name not in base_albums or "[Deluxe]" in album:
            base_albums[base_name] = album
            filtered_albums.append(album)
    else:
        base_name = album.split(" (")[0]  # Extract base album name ignoring editions
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
