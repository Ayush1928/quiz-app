import { FunctionComponent } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "./ui/label";

interface IQuestionItemProps {
    index: number;
    question: string;
    options: string[];
    onAnswerSelect: (index: number, option: string) => void;
    selectedAnswers: string[];
}

const QuestionItem: FunctionComponent<IQuestionItemProps> = ({ options, question, index, onAnswerSelect, selectedAnswers }) => {
    return (
        <div>
            <p className="text-2xl font-semibold">{index + 1}{`. `}{question}</p>
            <RadioGroup
                defaultValue={selectedAnswers[index] || "option-0"}
                onValueChange={(value) => onAnswerSelect(index, value)}
            >
                {options.map((option, index) => (
                    <div className="flex items-center space-x-2 text-xl font-semibold" key={index}>
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="text-xl font-semibold">
                            {option}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default QuestionItem;
