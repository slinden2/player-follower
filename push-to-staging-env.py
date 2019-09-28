import os
import shutil
import sys


if len(sys.argv) < 2:
    raise Exception('A commit message must be provided.')

COMMIT_MSG = sys.argv[1]
FILE_PATH = os.path.dirname(os.path.realpath(__file__))


def init_deploy():
    shutil.rmtree(os.path.join(FILE_PATH, 'web'))


def copy_backend():
    shutil.copytree(
        os.path.join(FILE_PATH, 'backend'),
        os.path.join(FILE_PATH, 'web'),
        ignore=shutil.ignore_patterns('node_modules', '.env', 'db.json', '.eslintrc.js', 'tests'))


def build_frontend():
    os.system('cd frontend && npm run build')


def copy_build_folder():
    shutil.copytree(
        os.path.join(FILE_PATH, 'frontend', 'build'),
        os.path.join(FILE_PATH, 'web', 'build'))
    shutil.rmtree(os.path.join(FILE_PATH, 'frontend', 'build'))


def push_to_heroku():
    os.system('git add web')
    os.system('git commit -m f"{COMMIT_MSG}"')
    os.system('git push origin master')
    os.system('git subtree push --prefix web staging master')


def main():
    init_deploy()
    copy_backend()
    build_frontend()
    copy_build_folder()
    push_to_heroku()


if __name__ == "__main__":
    main()
