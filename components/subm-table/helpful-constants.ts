export const statusTranslations: Record<string, string> = {
  waiting: "Gaida rindā",
  received: "Sagatavo datus",
  compiling: "Tiek kompilēts",
  testing: "Tiek testēts",
  finished: "Izvērtēts",
  error: "Servera kļūda",
  compile_error: "Kompilācijas kļūda",
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