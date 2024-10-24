import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock AI recommendation
const aiRecommendation = `
Based on the student's performance in software development:
1. Focus on improving understanding and skills in data structures, particularly those topics covered in recent assessments where scores were lower.
2. Maintain the strong performance in practical coding assignments, especially the notable work demonstrated in the project on APIs.
3. Consider allocating more study time to advanced algorithms and software architecture to elevate them to the level of proficiency shown in other areas.
4. Keep up the excellent work on front-end development and user experience design, where performance is significantly above class average.
5. In software development areas, backend integration seems to be a weaker point. Consider additional practice or seeking mentorship in this area.
6. The student excels in creative problem solving and debugging, which could be leveraged for leadership roles in team projects or in pursuing innovative software solutions.
`;

const RecommendationContent: React.FC = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations (WIP)</CardTitle>
          <CardDescription>
            Personalized suggestions for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-4 rounded-md whitespace-pre-wrap">
            {aiRecommendation}
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Focus Areas:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Quiz 2</Badge>
              <Badge variant="secondary">English</Badge>
              <Badge variant="secondary">Assignment 2</Badge>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Strengths:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Art</Badge>
              <Badge variant="default">Science</Badge>
              <Badge variant="default">Assignment 3</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecommendationContent;
