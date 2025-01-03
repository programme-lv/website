import { TestGroup, Verdict } from "@/types/proglv";

export function calculateTestScores(test_verdicts: Verdict[]) {
    const accepted = test_verdicts.filter(v => v === "ac").length;
    const untested = test_verdicts.filter(v => v === "q").length;
    const testing = test_verdicts.filter(v => v === "t").length;
    const wrong = test_verdicts.length - accepted - untested - testing;
    return { accepted, untested, wrong, testing };
}

export function calculateGroupScores(test_groups: TestGroup[], test_verdicts: Verdict[]) {
    let accepted_points = 0;
    let wrong_points = 0;
    let untested_points = 0;
    let testing_points = 0;

    for (let i = 0; i < test_groups.length; i++) {
        let group = test_groups[i];
        let tests = group.tg_tests;
        let tests_accepted = tests.filter(t => test_verdicts[t-1] === "ac").length;
        let tests_untested = tests.filter(t => test_verdicts[t-1] === "q").length;
        let tests_testing = tests.filter(t => test_verdicts[t-1] === "t").length;
        let tests_wrong = tests.length - tests_accepted - tests_untested - tests_testing;

        if (tests_accepted === tests.length) {
            accepted_points += group.points;
        } else if (tests_wrong > 0) {
            wrong_points += group.points;
        } else if (tests_untested === tests.length) {
            untested_points += group.points;
        } else {
            testing_points += group.points;
        }
    }

    return { accepted_points, wrong_points, untested_points, testing_points };
}