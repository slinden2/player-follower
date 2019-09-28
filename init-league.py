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
# print("Done.")
# print("Fetching players...")
# os.system(f"npm run fetch_players")
# print("Done.")
# print("Fetching stats...")
# os.system(f"npm run fetch_stats")
# print("Done.")

os.chdir('..')
print("Fetching boxscores...")
os.system(f"python run-fetch-boxscores.py")
print("Done.")

# os.chdir(FILE_PATH)
# print("Updating best players...")
# os.system(f"npm run update_best_players")
# print("Done.")
