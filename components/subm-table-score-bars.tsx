import { TestGroup, TestSet } from "@/types/proglv";

export function ErrorScoringBar() {
  return (
    <div className="flex justify-center flex-col items-center w-full min-w-36">
      <div className="relative pt-1 w-full">
        <div className="overflow-hidden h-1.5 text-xs flex rounded">
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(1 * 100).toFixed(0)}%`,
              // background: "linear-gradient(90deg, #9F7AEA, #6B46C1)",
              // background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,179,29,1) 100%)",
              background:
                "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(152,126,208,1) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

    // Start of Selection
    export function TestSetScoringBar({
      testset,
    }: {
      testset: TestSet;
    }) {
      let total_test_count = testset.accepted + testset.wrong + testset.untested;
      let green = total_test_count > 0 ? testset.accepted / total_test_count : 0;
      let red = total_test_count > 0 ? testset.wrong / total_test_count : 0;
      let gray = total_test_count > 0 ? testset.untested / total_test_count : 0;
    
      return (
        <div className="flex justify-center flex-col items-center w-full min-w-36">
          <div className="flex justify-between w-full items-center h-3 mb-1">
            {green > 0 && (
              <span className="text-teal-600 text-tiny">
                {`${(green * 100).toFixed(0)}%`}
              </span>
            )}
            {red > 0 && (
              <span className="text-red-500 text-tiny">
                {`${(red * 100).toFixed(0)}%`}
              </span>
            )}
            {gray > 0 && (
              <span className="text-gray-500 text-tiny">
                {`${(gray * 100).toFixed(0)}%`}
              </span>
            )}
          </div>
          <div className="relative pt-1 w-full">
            <div className="overflow-hidden h-1.5 text-xs flex rounded">
              {green > 0 && (
                <div
                  className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${(green * 100).toFixed(0)}%`,
                    background: "linear-gradient(90deg, #38b2ac, #2c7a7b)",
                  }}
                />
              )}
              {red > 0 && (
                <div
                  className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${(red * 100).toFixed(0)}%`,
                    background: "linear-gradient(90deg, #f56565, #c53030)",
                  }}
                />
              )}
              {gray > 0 && (
                <div
                  className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
                  style={{
                    width: `${(gray * 100).toFixed(0)}%`,
                    background: "linear-gradient(90deg, #a0aec0, #718096)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      );
    }

export function TestGroupScoringBar({
  testgroups,
}: {
  testgroups: TestGroup[];
}) {
  let green = 0;
  let yellow = 0;
  let gray = 0;
  let red = 0;

  let total_score = 0;

  for (const testgroup of testgroups) {
    total_score += testgroup.test_group_score;
  }

  for (const testgroup of testgroups) {
    const score = testgroup.test_group_score;
    const normalized_score = score / total_score;

    if (testgroup.wrong_tests > 0) {
      red += normalized_score;
      continue;
    }
    const finished = testgroup.untested_tests === 0;

    if (finished) {
      green += normalized_score;
    } else {
      yellow +=
        (normalized_score * testgroup.accepted_tests) /
        (testgroup.accepted_tests + testgroup.untested_tests);
      gray +=
        (normalized_score * testgroup.untested_tests) /
        (testgroup.accepted_tests + testgroup.untested_tests);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center w-full min-w-36">
      <div className="flex justify-between w-full items-center h-3">
        <span className="text-teal-600 text-tiny">
          {green > 0 ? `${(green * 100).toFixed(0)}%` : ""}
        </span>
        <span className="text-red-500 text-tiny">
          {red > 0 ? `${(red * 100).toFixed(0)}%` : ""}
        </span>
      </div>
      <div className="relative pt-1 w-full">
        <div className="overflow-hidden h-1.5 text-xs flex rounded">
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(green * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #38b2ac, #2c7a7b)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(yellow * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #ecc94b, #d69e2e)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(red * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #f56565, #c53030)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(gray * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #a0aec0, #718096)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function TestsScoringBar({
  accepted,
  wrong,
  untested,
}: {
  accepted: number;
  wrong: number;
  untested: number;
}) {
  let total_score = accepted + wrong + untested;
  let green = accepted / total_score;
  let gray = untested / total_score;
  let red = wrong / total_score;

  return (
    <div className="flex justify-center flex-col items-center w-full min-w-36">
      <div className="flex justify-between w-full items-center h-3">
        <span className="text-teal-600 text-tiny">
          {green > 0 ? `${(green * 100).toFixed(0)}%` : ""}
        </span>
        <span className="text-red-500 text-tiny">
          {red > 0 ? `${(red * 100).toFixed(0)}%` : ""}
        </span>
      </div>
      <div className="relative pt-1 w-full">
        <div className="overflow-hidden h-1.5 text-xs flex rounded">
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(green * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #38b2ac, #2c7a7b)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(red * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #f56565, #c53030)",
            }}
          />
          <div
            className="flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ease-in-out"
            style={{
              width: `${(gray * 100).toFixed(0)}%`,
              background: "linear-gradient(90deg, #a0aec0, #718096)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
