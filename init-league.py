import os

FILE_PATH = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), "backend")
os.chdir(FILE_PATH)

print("Fetching conferences...")
os.system(f"npm run fetch_conferences")
print("Done.")
print("Fetching divisions...")
os.system(f"npm run fetch_divisions")
print("Done.")
print("Fetching teams...")
os.system(f"npm run fetch_teams")
print("Done.")
print("Fetching team_stats...")
os.system(f"npm run fetch_team_stats")
print("Done.")
