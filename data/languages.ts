export type ProgrammingLang = {
  id: string;
  fullName: string;
  monacoId: string;
};

export default function getHardcodedLanguageList(): ProgrammingLang[] {
  const jsonString = `{
        "programming_languages": [
            {
                "id": "python3.10",
                "full_name": "Python 3.10",
                "code_filename": "main.py",
                "compile_cmd": null,
                "execute_cmd": "python3.10 main.py",
                "env_version_cmd": "python3.10 --version",
                "hello_world_code": "print(\\"Hello, World!\\")",
                "monaco_id": "python",
                "compiled_filename": null,
                "enabled": false
            },
            {
                "id": "python3.11",
                "full_name": "Python 3.11",
                "code_filename": "main.py",
                "compile_cmd": null,
                "execute_cmd": "python3.11 main.py",
                "env_version_cmd": "python3.10 --version",
                "hello_world_code": "print(\\"Hello, World!\\")",
                "monaco_id": "python",
                "compiled_filename": null,
                "enabled": true
            },
            {
                "id": "go1.19",
                "full_name": "Go 1.19",
                "code_filename": "main.go",
                "compile_cmd": "go build main.go",
                "execute_cmd": ".\\/main",
                "env_version_cmd": "go version",
                "hello_world_code": "package main\\nimport \\"fmt\\"\\nfunc main() {\\n    fmt.Println(\\"Hello, World!\\")\\n}",
                "monaco_id": "go",
                "compiled_filename": "main",
                "enabled": false
            },
            {
                "id": "go1.21",
                "full_name": "Go 1.21",
                "code_filename": "main.go",
                "compile_cmd": "go build main.go",
                "execute_cmd": ".\\/main",
                "env_version_cmd": "go version",
                "hello_world_code": "package main\\nimport \\"fmt\\"\\nfunc main() {\\n    fmt.Println(\\"Hello, World!\\")\\n}",
                "monaco_id": "go",
                "compiled_filename": "main",
                "enabled": true
            },
            {
                "id": "java21",
                "full_name": "Java SE 21",
                "code_filename": "Main.java",
                "compile_cmd": "javac Main.java",
                "execute_cmd": "java -Xss64M -Xmx1024M -Xms8M -XX:NewRatio=2 -XX:TieredStopAtLevel=1 -XX:+UseSerialGC Main",
                "env_version_cmd": "java --version",
                "hello_world_code": "public class Main {\\n    public static void main(String[] args) {\\n        System.out.println(\\"Hello, World!\\");\\n    }\\n}",
                "monaco_id": "java",
                "compiled_filename": "Main.class",
                "enabled": true
            },
            {
                "id": "cpp17",
                "full_name": "C++17 (GCC)",
                "code_filename": "main.cpp",
                "compile_cmd": "g++ -std=c++17 -o main main.cpp",
                "execute_cmd": ".\\/main",
                "env_version_cmd": "g++ --version",
                "hello_world_code": "#include <iostream>\\nint main() { std::cout << \\"Hello, World!\\" << std::endl; }",
                "monaco_id": "cpp",
                "compiled_filename": "main",
                "enabled": true
            }
        ]
    }`;

  const data = JSON.parse(jsonString);

  return data.programming_languages.map((lang: any) => ({
    id: lang.id,
    fullName: lang.full_name,
    monacoId: lang.monaco_id,
  }));
}
