
export const EXIT_SIGNAL_DESCRIPTIONS: Record<number, string> = {
    1: "SIGHUP - Terminate - Hang up controlling terminal or process",
    2: "SIGINT - Terminate - Interrupt from keyboard, Control-C",
    3: "SIGQUIT - Dump - Quit from keyboard, Control-\\",
    4: "SIGILL - Dump - Illegal instruction",
    5: "SIGTRAP - Dump - Breakpoint for debugging",
    6: "SIGABRT/SIGIOT - Dump - Abnormal termination / Equivalent to SIGABRT",
    7: "SIGBUS - Dump - Bus error",
    8: "SIGFPE - Dump - Floating-point exception",
    9: "SIGKILL - Terminate - Forced-process termination",
    10: "SIGUSR1 - Terminate - Available to processes",
    11: "SIGSEGV - Dump - Invalid memory reference",
    12: "SIGUSR2 - Terminate - Available to processes",
    13: "SIGPIPE - Terminate - Write to pipe with no readers",
    14: "SIGALRM - Terminate - Real-timer clock",
    15: "SIGTERM - Terminate - Process termination",
    16: "SIGSTKFLT - Terminate - Coprocessor stack error",
    17: "SIGCHLD - Ignore - Child process stopped or terminated or got a signal if traced",
    18: "SIGCONT - Continue - Resume execution, if stopped",
    19: "SIGSTOP - Stop - Stop process execution, Ctrl-Z",
    20: "SIGTSTP - Stop - Stop process issued from tty",
    21: "SIGTTIN - Stop - Background process requires input",
    22: "SIGTTOU - Stop - Background process requires output",
    23: "SIGURG - Ignore - Urgent condition on socket",
    24: "SIGXCPU - Dump - CPU time limit exceeded",
    25: "SIGXFSZ - Dump - File size limit exceeded",
    26: "SIGVTALRM - Terminate - Virtual timer clock",
    27: "SIGPROF - Terminate - Profile timer clock",
    28: "SIGWINCH - Ignore - Window resizing",
    29: "SIGIO/SIGPOLL - Terminate - I/O now possible / Equivalent to SIGIO",
    30: "SIGPWR - Terminate - Power supply failure",
    31: "SIGSYS/SIGUNUSED - Dump - Bad system call / Equivalent to SIGSYS",
  };