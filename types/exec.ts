// Define a union type for the possible stages
type Stage =
    | "waiting"
    | "compiling"
    | "testing"
    | "finished"
    | "compile_error"
    | "internal_error";

// Runtime Data Interface
interface RunData {
    in: string;
    out: string;
    err: string;
    cpu_ms: number;      // CPU user-mode time in milliseconds
    wall_ms: number;     // Wall clock time in milliseconds
    mem_kib: number;     // Memory usage in kibibytes
    exit: number;        // Exit code
    ctx_sw_v: number;    // Context switches voluntarily
    ctx_sw_f: number;    // Context switches forced
    signal: number | null; // Exit signal if any
}

// Test Result Interface
interface TestRes {
    id: number;
    inp: string | null;        // Test input
    ans: string | null;        // Test answer
    rch: boolean;              // Reached
    ign: boolean;              // Ignored
    fin: boolean;              // Finished
    subm_rd: RunData | null;   // User submitted solution runtime data
    tlib_rd: RunData | null;   // Testlib checker runtime data
}

// Programming Language Interface
interface PrLang {
    short_id: string;           // Short lang/compiler/interpreter ID
    display: string;            // User-friendly programming language name
    code_fname: string;         // Source code filename for moving into the environment
    comp_cmd: string | null;    // Compile command (optional)
    comp_fname: string | null;  // Executable filename after compilation (optional)
    exec_cmd: string;           // Execution command
}

// Tester Parameters Interface
interface TesterParams {
    cpu_ms: number;             // Maximum user-mode CPU time in milliseconds
    mem_kib: number;            // Maximum resident set size in kibibytes
    checker: string | null;     // Optional testlib.h checker program
    interactor: string | null;  // Optional testlib.h interactor program
}

interface Execution {
    uuid: string;               // Unique identifier
    stage: Stage;               // Current stage of execution
    test_res: TestRes[];        // Array of test results
    pr_lang: PrLang;            // Programming language details
    params: TesterParams;       // Tester machine submitted solution runtime constraints
    error_msg: string | null;   // Error message if any
    sys_info: string | null;    // System information (testing hardware info)
    created_at: string;         // ISO 8601 formatted date string
    subm_comp: RunData | null;  // Submitted code compilation runtime data
}

export type {
    Execution,
    RunData,
    TestRes,
    PrLang,
    TesterParams,
};