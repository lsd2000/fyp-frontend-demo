import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import StudentContext from "../StudentContext";
import {
  CombinedQuizResultWithStats,
  CombinedClassPartData,
} from "@/pages/types";
// Mock data

const FilterPopover: React.FC = () => {
  const {
    combinedGradedQuizResults,
    setCombinedGradedQuizResults,
    combinedUngradedQuizResults,
    setCombinedUngradedQuizResults,
    combinedMetricResults,
    setCombinedMetricResults,
  } = useContext(StudentContext);

  // Duplicate the combined results for local manipulation
  const [localGradedQuizResults, setLocalGradedQuizResults] = useState<
    CombinedQuizResultWithStats[]
  >([]);
  const [localUngradedQuizResults, setLocalUngradedQuizResults] = useState<
    CombinedQuizResultWithStats[]
  >([]);
  const [localMetricResults, setLocalMetricResults] = useState<
    CombinedClassPartData[]
  >([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (
      !hasLoaded.current && // Check if it hasn't loaded before
      combinedGradedQuizResults.length > 0 &&
      combinedMetricResults.length > 0 &&
      localGradedQuizResults.length === 0 &&
      localMetricResults.length === 0 &&
      combinedUngradedQuizResults.length > 0 &&
      localUngradedQuizResults.length === 0
    ) {
      setLocalGradedQuizResults([...combinedGradedQuizResults]);
      setLocalMetricResults([...combinedMetricResults]);
      setLocalUngradedQuizResults([...combinedUngradedQuizResults]);
      // Set the ref to true to prevent further loading
      hasLoaded.current = true;
    }
  }, [combinedGradedQuizResults, combinedMetricResults]);

  const handleGradedQuizChange = (quizName: string) => {
    setCombinedGradedQuizResults((prev) => {
      const index = prev.findIndex((quiz) => quiz.quiz_name === quizName);

      // Removing the quiz if it exists in combinedGradedQuizResults
      if (index >= 0) {
        const newQuizzes = prev.filter((quiz) => quiz.quiz_name !== quizName);
        return newQuizzes;
      } else {
        // Adding the quiz if it's not found in combinedGradedQuizResults
        const quizToAdd = localGradedQuizResults.find(
          (quiz) => quiz.quiz_name === quizName
        );

        // Ensure quiz exists in localGradedQuizResults before adding
        if (quizToAdd) {
          const newQuizzes = [...prev, quizToAdd];
          return newQuizzes;
        }
      }

      // Returning the same array if no changes are made
      return prev;
    });
  };

  const handleUngradedQuizChange = (quizName: string) => {
    setCombinedUngradedQuizResults((prev) => {
      const index = prev.findIndex((quiz) => quiz.quiz_name === quizName);

      // Removing the quiz if it exists in combinedGradedQuizResults
      if (index >= 0) {
        const newQuizzes = prev.filter((quiz) => quiz.quiz_name !== quizName);
        return newQuizzes;
      } else {
        // Adding the quiz if it's not found in combinedGradedQuizResults
        const quizToAdd = localUngradedQuizResults.find(
          (quiz) => quiz.quiz_name === quizName
        );

        // Ensure quiz exists in localGradedQuizResults before adding
        if (quizToAdd) {
          const newQuizzes = [...prev, quizToAdd];
          return newQuizzes;
        }
      }

      // Returning the same array if no changes are made
      return prev;
    });
  };

  const handleWeekChange = (week: string) => {
    setCombinedMetricResults((prev) => {
      const index = prev.findIndex((metric) => metric.week === week);

      // Removing the quiz if it exists in combinedGradedQuizResults
      if (index >= 0) {
        const newWeek = prev.filter((metric) => metric.week !== week);
        return newWeek;
      } else {
        // Adding the quiz if it's not found in combinedGradedQuizResults
        const weekToAdd = localMetricResults.find(
          (metric) => metric.week === week
        );

        // Ensure quiz exists in localGradedQuizResults before adding
        if (weekToAdd) {
          const newWeeks = [...prev, weekToAdd];
          return newWeeks;
        }
      }

      // Returning the same array if no changes are made
      return prev;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            (combinedGradedQuizResults.length > 0 ||
              combinedUngradedQuizResults.length > 0 ||
              combinedMetricResults.length > 0) &&
              "text-primary"
          )}
        >
          <Filter className="mr-2 h-4 w-4" />
          {combinedGradedQuizResults.length > 0 ||
          combinedUngradedQuizResults.length > 0 ||
          combinedMetricResults.length > 0 ? (
            <>Filter applied</>
          ) : (
            <span>Select items to filter</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Graded Quizzes</h3>
              <div className="grid grid-cols-2 gap-2">
                {localGradedQuizResults.map((quiz) => {
                  // Dynamically calculate if the checkbox should be checked
                  const isChecked = combinedGradedQuizResults.some(
                    (q) => q.quiz_name === quiz.quiz_name
                  );
                  return (
                    <div
                      key={quiz.quiz_name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={quiz.quiz_name}
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleGradedQuizChange(quiz.quiz_name)
                        }
                      />
                      <Label htmlFor={quiz.quiz_name}>{quiz.quiz_name}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ungraded Quizzes</h3>
              <div className="grid grid-cols-2 gap-2">
                {localUngradedQuizResults.map((quiz) => {
                  // Dynamically calculate if the checkbox should be checked
                  const isChecked = combinedUngradedQuizResults.some(
                    (q) => q.quiz_name === quiz.quiz_name
                  );
                  return (
                    <div
                      key={quiz.quiz_name}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={quiz.quiz_name}
                        checked={isChecked}
                        onCheckedChange={() =>
                          handleUngradedQuizChange(quiz.quiz_name)
                        }
                      />
                      <Label htmlFor={quiz.quiz_name}>{quiz.quiz_name}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Class Participation</h3>
              <div className="grid grid-cols-3 gap-2">
                {localMetricResults.map((entry) => (
                  <div key={entry.week} className="flex items-center space-x-2">
                    <Checkbox
                      id={entry.week}
                      checked={combinedMetricResults.some(
                        (metric) => metric.week === entry.week
                      )}
                      onCheckedChange={() => handleWeekChange(entry.week)}
                    />
                    <Label htmlFor={entry.week}>{entry.week}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
