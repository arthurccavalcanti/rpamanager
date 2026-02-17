import os
from pathlib import Path
import importlib.util

def getRpaFunction(tipoRpa: str):

    project_path = Path.cwd()
    rpas_path = project_path / "src" / "python_workers" / "rpas"
    file_name = tipoRpa + ".py"

    for file in os.listdir(rpas_path):
        if file == file_name:
            print('RPA existe.')
            try:
                rpa_path = rpas_path / file_name
                spec = importlib.util.spec_from_file_location(file_name, rpa_path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                print(f"Função RPA: {file_name}")
                return getattr(module, tipoRpa)
            except Exception as e:
                print(f"Erro ao carregar função: {e}")
                raise ValueError("Erro ao carregar RPA.")
    raise ValueError(f"Tipo de RPA fornecido ({tipoRpa}) não existe.")


if __name__ == "__main__":
    function = getRpaFunction("headlines")
    print(function)