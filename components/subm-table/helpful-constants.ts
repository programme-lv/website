export const statusTranslations: Record<string, string> = {
  waiting: "Gaida",
  received: "Sagatavo",
  compiling: "Kompilē",
  testing: "Testē",
  finished: "Izvērtēts",
  error: "Servera kļūda",
  compile_error: "Kļūda",
  runtime_error: "Izpildes kļūda",
  checker_error: "Servera kļūda",
};

export const statusImportance: Record<string, number> = {
  waiting: 0,
  received: 1,
  compiling: 2,
  testing: 3,
  finished: 4,
  error: 5,
  compile_error: 6,
  runtime_error: 7,
  checker_error: 8,
};