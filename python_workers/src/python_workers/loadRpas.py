import os
from pathlib import Path

def loadRpas():

    rpas_list =[]
    project_path = Path.cwd()
    rpas_path = project_path / "src" / "python_workers" / "rpas"
    
    for file in os.listdir(rpas_path):
        if file == "__init__.py" or file == '__pycache__':
            continue
        rpas_list.append(file.removesuffix('.py'))
    print('Lista pronta: ', rpas_list)

    return rpas_list

