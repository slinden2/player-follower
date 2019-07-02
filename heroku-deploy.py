import os
import shutil
import sys

FILE_PATH = os.path.dirname(os.path.realpath(__file__))
print(FILE_PATH)


def init_deploy():
    shutil.rmtree(f"{FILE_PATH}\\web")


def copy_backend():
    shutil.copytree(
        f"{FILE_PATH}\\backend",
        f"{FILE_PATH}\\web",
        ignore=shutil.ignore_patterns('node_modules', '.env', 'db.json', '.eslintrc.js'))


def build_frontend():
    os.system('cd frontend && npm run build')


def copy_build_folder():
    shutil.copytree(
        f"{FILE_PATH}\\frontend\\build",
        f"{FILE_PATH}\\web\\build",
        ignore=shutil.ignore_patterns('node_modules', '.env', 'db.json', '.eslintrc.js'))


def push_to_heroku():
    os.system('git subtree push --prefix web heroku master')


def main():
    init_deploy()
    copy_backend()
    build_frontend()
    copy_build_folder()
    push_to_heroku()


if __name__ == "__main__":
    main()
